import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '../components/Icons';
import type { Document, DocumentGroup, DocumentStatus } from '../types';
import { documentService } from '../services/documentService';
import { apiClient } from '../services/api';

const statusBadge: Record<DocumentStatus, { text: string; color: string }> = {
  uploaded: { text: '업로드',   color: 'bg-gray-100 text-gray-700' },
  processing: { text: '인덱싱 중', color: 'bg-amber-100 text-amber-700' },
  processed: { text: '완료',     color: 'bg-green-100 text-green-700' },
  failed: { text: '실패',      color: 'bg-red-100 text-red-700' },
};

const UploadPage: React.FC = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null); // null = 루트
  const [draggingDocId, setDraggingDocId] = useState<string | null>(null);
  const [personaDraft, setPersonaDraft] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [indexingId, setIndexingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ensureToken = () => {
    if (!apiClient.token) {
      alert('JWT 토큰을 설정해 주세요. (localStorage codeme_jwt)');
      return false;
    }
    return true;
  };

  const fetchDocs = async () => {
    try {
      setLoading(true);
      setError(null);
      const [docsRes, groupsRes] = await Promise.all([
        documentService.list(),
        documentService.listGroups(),
      ]);
      setDocs(docsRes);
      setGroups(groupsRes);
      if (selectedGroupId) {
        const current = groupsRes.find(g => g.id === selectedGroupId);
        setPersonaDraft(current?.persona_prompt || '');
      }
    } catch (e: any) {
      setError(e.message || '문서 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedGroupId]);

  // 간단한 폴링: 처리 중 문서가 있을 때 주기적으로 목록을 갱신해 콜백 상태를 반영
  useEffect(() => {
    const hasProcessing = docs.some(d => d.status === 'processing');
    if (!hasProcessing) return;

    const intervalId = window.setInterval(() => {
      fetchDocs();
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [docs]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ensureToken()) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await documentService.upload({ file, title: file.name, group_id: selectedGroupId || undefined });
      await fetchDocs();
    } catch (err: any) {
      setError(err.message || '업로드 실패');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!ensureToken()) return;
    if (!window.confirm('문서를 삭제하시겠습니까?')) return;

    try {
      await documentService.delete(id);
      setDocs(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      setError(err.message || '삭제 실패');
    }
  };

  const handleCreateGroup = async () => {
    if (!ensureToken()) return;
    const name = window.prompt('새 폴더 이름을 입력하세요.');
    if (!name) return;
    try {
      const newGroup = await documentService.createGroup(name);
      setGroups(prev => [...prev, newGroup]);
    } catch (err: any) {
      setError(err.message || '폴더 생성 실패');
    }
  };

  const handleRenameGroup = async (group: DocumentGroup) => {
    if (!ensureToken()) return;
    const newName = window.prompt('폴더 이름을 변경하세요.', group.name);
    if (!newName) return;
    try {
      const updated = await documentService.renameGroup(group.id, newName);
      setGroups(prev => prev.map(g => (g.id === group.id ? updated : g)));
    } catch (err: any) {
      setError(err.message || '폴더 이름 변경 실패');
    }
  };

  const handleDeleteGroup = async (group: DocumentGroup) => {
    if (!ensureToken()) return;
    if (!window.confirm('이 폴더와 폴더 안의 문서를 모두 삭제할까요?')) return;
    try {
      await documentService.deleteGroup(group.id);
      setGroups(prev => prev.filter(g => g.id !== group.id));
      setDocs(prev => prev.filter(d => d.group_id !== group.id));
      if (selectedGroupId === group.id) setSelectedGroupId(null);
    } catch (err: any) {
      setError(err.message || '폴더 삭제 실패');
    }
  };

  const handleMoveDoc = async (docId: string, groupId: string | null) => {
    if (!ensureToken()) return;
    try {
      const updated = await documentService.moveDocumentToGroup(docId, groupId);
      setDocs(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    } catch (err: any) {
      setError(err.message || '이동 실패');
    } finally {
      setDraggingDocId(null);
    }
  };

  const handleSavePersona = async () => {
    if (!ensureToken()) return;
    if (!selectedGroupId) {
      setError('먼저 폴더를 선택하세요.');
      return;
    }
    try {
      const updated = await documentService.updateGroupPersona(selectedGroupId, personaDraft);
      setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));
    } catch (err: any) {
      setError(err.message || '페르소나 저장 실패');
    }
  };

  const handleIndex = async (id: string) => {
    if (!ensureToken()) return;

    setIndexingId(id);
    setError(null);

    try {
      const updated = await documentService.triggerIndex(id);
      setDocs(prev => prev.map(d => (d.id === id ? updated : d)));
    } catch (err: any) {
      setError(err.message || '인덱싱 트리거 실패');
    } finally {
      setIndexingId(null);
    }
  };

  const visibleDocs = selectedGroupId ? docs.filter(d => d.group_id === selectedGroupId) : docs;

  const processedCount = docs.filter(d => d.status === 'processed').length;
  const progressPercent =
    docs.length === 0 ? 0 : Math.min((processedCount / docs.length) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-800 mb-1">파일 관리</h1>
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <p className="text-gray-600 text-sm">
            파일을 업로드하면 Hey Me가 내용을 학습하여 채팅 답변에 활용합니다.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 업로드 카드 (기존 UI 유지) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-[400px] cursor-pointer hover:bg-gray-50 transition-colors group"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Icons.Upload size={32} />
            </div>
            <h3 className="text-gray-900 font-semibold mb-2">
              파일을 드래그하거나 클릭하여 업로드
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              PDF, TXT, MD 등 텍스트 기반 파일을 지원합니다.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              JWT 토큰은 <code>localStorage.codeme_jwt</code> 값이 사용됩니다.
            </p>
            <div className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium shadow-lg shadow-purple-200 pointer-events-none">
              {uploading ? '업로드 중...' : '파일 선택'}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* 오른쪽: 문서 리스트 (기존 레이아웃 + 백엔드 데이터) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">내 문서</h3>
                <p className="text-sm text-gray-500">총 {docs.length}개</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span>인덱싱 완료</span>
                  <span className="font-bold text-purple-600">
                    {processedCount}개
                  </span>
                </div>
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreateGroup}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Icons.FolderPlus size={14} />
                  폴더 추가
                </button>
              </div>
            </div>

            <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto text-sm">
              <button
                onClick={() => setSelectedGroupId(null)}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (draggingDocId) {
                    handleMoveDoc(draggingDocId, null);
                  }
                }}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs ${
                  selectedGroupId === null
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                <Icons.FolderOpen size={14} />
                전체
              </button>

              {groups.map(group => (
                <div
                  key={group.id}
                  onDoubleClick={() => setSelectedGroupId(group.id)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    if (draggingDocId) {
                      handleMoveDoc(draggingDocId, group.id);
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs cursor-pointer ${
                    selectedGroupId === group.id
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <Icons.Folder size={14} />
                  <span>{group.name}</span>
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-gray-700"
                    onClick={e => {
                      e.stopPropagation();
                      handleRenameGroup(group);
                    }}
                  >
                    <Icons.Edit size={12} />
                  </button>
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-red-600"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteGroup(group);
                    }}
                  >
                    <Icons.Trash size={12} />
                  </button>
                </div>
              ))}
            </div>

            {selectedGroupId && (
              <div className="px-6 pb-4">
                <label className="text-xs text-gray-500 block mb-1">폴더 페르소나 / 시스템 프롬프트</label>
                <textarea
                  value={personaDraft}
                  onChange={e => setPersonaDraft(e.target.value)}
                  placeholder="이 폴더의 문서 기반 챗봇에게 적용할 톤/지침을 입력하세요."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSavePersona}
                    className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
                  >
                    페르소나 저장
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-y-auto flex-1 p-2">
              {loading ? (
                <div className="p-6 text-center text-gray-500">
                  불러오는 중...
                </div>
              ) : docs.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  업로드된 문서가 없습니다.
                </div>
              ) : (
                visibleDocs.map(doc => {
                  const badge = statusBadge[doc.status];
                  const dateStr = new Date(
                    doc.updated_at || doc.created_at,
                  ).toLocaleString();

                  return (
                    <div
                      key={doc.id}
                      draggable
                      onDragStart={() => setDraggingDocId(doc.id)}
                      onDragEnd={() => setDraggingDocId(null)}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <div className="grid grid-cols-12 items-center p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-100 text-gray-500">
                            <Icons.File size={16} />
                          </div>
                          <div className="flex flex-col overflow-hidden w-full">
                            <span className="text-sm font-medium text-gray-700 truncate pr-2">
                              {doc.title || doc.original_file_name}
                            </span>
                            <div className="text-xs text-gray-500 truncate pr-2">
                              {doc.original_file_name} ·{' '}
                              {doc.mime_type || 'unknown'} ·{' '}
                              {doc.size_bytes
                                ? `${(doc.size_bytes / 1024).toFixed(1)} KB`
                                : '—'}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-3 text-xs text-gray-500">
                          {dateStr}
                        </div>

                        <div className="col-span-2 flex items-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}
                          >
                            {badge.text}
                          </span>
                        </div>

                        <div className="col-span-2 flex justify-end gap-2 items-center">
                          <button
                            onClick={() => handleIndex(doc.id)}
                            disabled={
                              indexingId === doc.id ||
                              doc.status === 'processing' ||
                              doc.status === 'processed'
                            }
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs border transition-colors ${
                              doc.status === 'processed'
                                ? 'bg-green-100 text-green-700 border-green-200 cursor-default'
                                : doc.status === 'processing' || indexingId === doc.id
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 cursor-wait'
                                  : 'text-gray-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700'
                            } disabled:opacity-60`}
                          >
                            {doc.status === 'processed'
                              ? '인덱싱 완료'
                              : doc.status === 'processing' || indexingId === doc.id
                                ? '인덱싱 중...'
                                : '인덱싱'}
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Icons.Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
