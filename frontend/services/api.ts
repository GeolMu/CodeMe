const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) || 'http://localhost:9000';
const TOKEN_KEY = 'codeme_jwt';

const getCookie = (name: string): string | null => {
  const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const clearCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export interface LinkChatRequest {
  link_id: string;
  question: string;
}

export interface LinkChatResponse {
  answer: string;
}

// 공개 링크 정보 조회 응답
export interface LinkInfoResponse {
  link_id: string;
  user_name: string;
  folder_name?: string;
  title?: string;
  is_active: boolean;
}

export const apiClient = {
  get token() {
    const cookie = getCookie(TOKEN_KEY);
    if (cookie) return cookie;
    const local = localStorage.getItem(TOKEN_KEY);
    return local || '';
  },
  setToken(token: string) {
    // 쿠키 우선, 로컬스토리지 병행 저장(백업용)
    setCookie(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    clearCookie(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(init.headers as Record<string, string> || {}),
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    const resp = await fetch(`${BASE_URL}${path}`, { ...init, headers });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`API ${resp.status}: ${text}`);
    }
    // 204 No Content
    if (resp.status === 204) return undefined as T;
    return resp.json() as Promise<T>;
  },
};

export const getApiBase = () => BASE_URL;

// 공개 링크 챗봇 호출 (Authorization 없이)
export async function askLinkChat(payload: LinkChatRequest): Promise<LinkChatResponse> {
  const resp = await fetch(`${BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Link chat failed: ${resp.status} ${text}`);
  }

  return resp.json() as Promise<LinkChatResponse>;
}

// 공개 링크 정보 조회 (Authorization 없이)
export async function getLinkInfo(linkId: string): Promise<LinkInfoResponse> {
  const resp = await fetch(`${BASE_URL}/api/v1/links/${linkId}/info`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Get link info failed: ${resp.status} ${text}`);
  }

  return resp.json() as Promise<LinkInfoResponse>;
}
