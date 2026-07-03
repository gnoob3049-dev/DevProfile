const API_BASE = '';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('devprofile-token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // auth
  register: (name: string, email: string, password: string) =>
    apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => apiFetch('/api/auth/me'),

  // profile
  createOrUpdateProfile: (data: { username: string; bio: string; location: string; githubUsername: string; skills: string[]; lookingFor: string }) =>
    apiFetch('/api/profile', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (username: string) => apiFetch(`/api/profile/${username}`),
  getMyProfile: () => apiFetch('/api/profile'),

  // github
  getGitHubData: (githubUsername: string) => apiFetch(`/api/github/${githubUsername}`),
  getReadme: (githubUsername: string) => apiFetch(`/api/readme/${githubUsername}`),

  // developers
  getDevelopers: (params?: { skill?: string; search?: string; lookingFor?: string; page?: number; limit?: number; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.skill) searchParams.set('skill', params.skill);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.lookingFor) searchParams.set('lookingFor', params.lookingFor);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.sort) searchParams.set('sort', params.sort);
    const qs = searchParams.toString();
    return apiFetch(`/api/developers${qs ? `?${qs}` : ''}`);
  },

  // follow
  follow: (userId: string) => apiFetch(`/api/follow/${userId}`, { method: 'POST' }),
  unfollow: (userId: string) => apiFetch(`/api/follow/${userId}`, { method: 'DELETE' }),
  getFollowers: (userId: string) => apiFetch(`/api/follow/${userId}/followers`),
  getFollowing: (userId: string) => apiFetch(`/api/follow/${userId}/following`),

  // endorse
  endorse: (userId: string, skill: string) => apiFetch(`/api/endorse/${userId}/${encodeURIComponent(skill)}`, { method: 'POST' }),

  // activity
  getActivity: (userId: string) => apiFetch(`/api/activity/${userId}`),
};