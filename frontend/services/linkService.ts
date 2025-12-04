import { apiClient } from './api';
import type { Link } from '../types';

export const linkService = {
  async createForGroup(groupId: string, title?: string): Promise<Link> {
    // FastAPI 라우트가 /links/ 로 정의되어 307 리다이렉트 방지 위해 슬래시 포함
    return apiClient.request<Link>('/api/v1/links/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        title: title || '폴더 기반 공유 링크',
      }),
    });
  },
};
