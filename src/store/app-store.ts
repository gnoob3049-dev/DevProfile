import { create } from 'zustand';

export interface ProfileData {
  id: string;
  userId: string;
  username: string;
  bio: string;
  location: string;
  githubUsername: string;
  skills: string[];
  lookingFor: string;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  endorsements: { skill: string; count: number; endorsedByMe: boolean }[];
}

export interface GitHubData {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  top_repos: {
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    fork: boolean;
  }[];
  languages: { [lang: string]: number };
}

interface AppState {
  // Routing
  currentPage: string;
  routeParams: Record<string, string>;
  navigate: (page: string, params?: Record<string, string>) => void;

  // Auth
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  profile: ProfileData | null;
  githubData: GitHubData | null;
  setAuth: (token: string, user: { id: string; name: string; email: string }) => void;
  setProfile: (profile: ProfileData | null) => void;
  setGitHubData: (data: GitHubData | null) => void;
  logout: () => void;
}

function getInitialAuth(): { token: string | null; user: { id: string; name: string; email: string } | null } {
  if (typeof window === 'undefined') return { token: null, user: null };
  try {
    const token = localStorage.getItem('devprofile-token');
    const userStr = localStorage.getItem('devprofile-user');
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
  } catch {
    // ignore
  }
  return { token: null, user: null };
}

export const useAppStore = create<AppState>((set) => {
  const { token, user } = getInitialAuth();
  return {
    // Routing
    currentPage: 'landing',
    routeParams: {},
    navigate: (page, params = {}) =>
      set({ currentPage: page, routeParams: params }),

    // Auth
    token,
    user,
    profile: null,
    githubData: null,
    setAuth: (newToken, newUser) => {
      localStorage.setItem('devprofile-token', newToken);
      localStorage.setItem('devprofile-user', JSON.stringify(newUser));
      set({ token: newToken, user: newUser });
    },
    setProfile: (profile) => set({ profile }),
    setGitHubData: (data) => set({ githubData: data }),
    logout: () => {
      localStorage.removeItem('devprofile-token');
      localStorage.removeItem('devprofile-user');
      set({ token: null, user: null, profile: null, githubData: null, currentPage: 'landing' });
    },
  };
});