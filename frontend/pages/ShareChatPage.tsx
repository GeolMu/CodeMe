import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '../components/Icons';
import type { ChatMessage, DocumentGroup } from '../types';
import { documentService } from '../services/documentService';
import { chatService } from '../services/chatService';
import { linkService } from '../services/linkService';
import { apiClient } from '../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const ShareChatPage: React.FC = () => {
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true); // 초기 로드 추적

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await documentService.listGroups();
        setGroups(res);
        // 기본적으로 첫 번째 그룹을 선택해 공유/챗봇이 동작하도록 한다.
        if (res.length > 0) {
          setSelectedGroupId(res[0].id);
          setMessages([]);
        }
      } catch (err: any) {
        console.error('Failed to load groups:', err);
      }
    };
    fetchGroups();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiClient.token) {
      alert('로그인이 필요합니다. JWT 토큰을 설정해주세요.');
      return;
    }

    const question = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await chatService.chatWithRag({
        question,
        group_id: selectedGroupId,
        top_k: 5,
      });
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setError(err.message || '답변을 가져오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShareLink = async () => {
    if (!selectedGroupId) {
      alert('공유할 폴더를 선택하세요.');
      return;
    }
    if (!apiClient.token) {
      alert('로그인이 필요합니다. JWT 토큰을 설정해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      const link = await linkService.createForGroup(selectedGroupId);
      const base = window.location.origin;
      const url = `${base}/c/${link.id}`;
      setShareUrl(url);
      setGeneratedUrl(url);
      setShowLinkDialog(true);
      setCopied(false);
    } catch (err: any) {
      setError(err.message || '공유 링크를 생성하지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="bg-[#1a0b2e] shadow-xl border border-gray-800 rounded-2xl h-full flex overflow-hidden">
          {/* 왼쪽 사이드바 - 폴더 리스트 */}
          <div className="w-64 border-r border-gray-700 bg-[#0f0820] flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold text-sm">폴더 목록</h3>
              <p className="text-xs text-purple-300 mt-1">폴더를 선택하세요</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setMessages([]);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-lg mb-1 transition-all group hover:bg-purple-600/20 ${
                    selectedGroupId === group.id
                      ? 'bg-purple-600/30 border border-purple-500/50'
                      : 'bg-transparent border border-transparent hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Icons.Folder 
                      size={16} 
                      className={selectedGroupId === group.id ? 'text-purple-400 mt-0.5' : 'text-gray-500 mt-0.5 group-hover:text-purple-400'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        selectedGroupId === group.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`}>
                        {group.name}
                      </div>
                      {group.description && (
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {group.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 오른쪽 메인 영역 - 채팅 */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-white">공유용 챗봇</h2>
                  <span className="text-xs text-purple-300">
                    선택된 폴더 문서만 기반으로 답변합니다.
                  </span>
                  {selectedGroupId && (
                    <span className="text-[11px] text-purple-400 mt-1">
                      현재 폴더: {groups.find(g => g.id === selectedGroupId)?.name || '알 수 없음'}
                    </span>
                  )}
                  {shareUrl && (
                    <span className="text-xs text-pink-400 mt-1 break-all">
                      공유 링크: {shareUrl}
                    </span>
                  )}
                </div>
                <button
                  disabled={!selectedGroupId || isLoading}
                  onClick={handleCreateShareLink}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${
                    selectedGroupId
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Icons.Link size={14} />
                  링크 생성하기
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#1e1b2e]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {error && (
                  <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-3 py-2 rounded-lg">
                    {error}
                  </div>
                )}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-lg ${
                        msg.role === 'user'
                          ? 'bg-gray-700 text-white rounded-tr-sm'
                          : 'bg-[#2d2b42] border border-gray-700 text-gray-100 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                      <div className="mt-1 text-[10px] text-gray-500">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-700 bg-[#1a0b2e]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="질문을 입력하세요"
                    className="flex-1 rounded-xl border border-gray-700 bg-white/5 text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-3 rounded-xl bg-purple-600 text-white font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors"
                  >
                    {isLoading ? <Icons.Loader2 className="animate-spin" size={18} /> : <Icons.Send size={18} />}
                    {isLoading ? '전송 중' : '전송'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 링크 생성 Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="bg-[#1a0b2e] border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">공유 링크 생성 완료</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-purple-300">
                생성된 링크
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-gray-700 text-sm text-gray-300 break-all">
                  {generatedUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Icons.Check size={16} />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Icons.Copy size={16} />
                      복사
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Icons.Info size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-xs text-purple-200">
                  <p>• 이 링크를 통해 다른 사람들이 챗봇을 사용할 수 있습니다.</p>
                  <p>• 선택된 폴더의 문서만 기반으로 답변합니다.</p>
                  <p>• 링크는 영구적으로 유효합니다.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareChatPage;