import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCache } from '@/lib/github-cache';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  languages_url: string;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface LanguageBytes {
  [language: string]: number;
}

async function fetchRepoLanguages(url: string): Promise<LanguageBytes> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'DevProfile-App' },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ githubUsername: string }> }
) {
  try {
    const { githubUsername } = await params;

    const cached = getCached<ReturnType<typeof buildResponse>>(githubUsername);
    if (cached) {
      return NextResponse.json(cached);
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${githubUsername}`, {
        headers: { 'User-Agent': 'DevProfile-App' },
      }),
      fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=100`,
        { headers: { 'User-Agent': 'DevProfile-App' } }
      ),
    ]);

    if (!userRes.ok) {
      return NextResponse.json(
        { error: 'GitHub user not found' },
        { status: userRes.status === 404 ? 404 : 500 }
      );
    }

    if (!reposRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch GitHub repos' },
        { status: 500 }
      );
    }

    const githubUser: GitHubUser = await userRes.json();
    const repos: GitHubRepo[] = await reposRes.json();

    // Fetch languages for top 6 repos
    const topReposRaw = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const languageResults = await Promise.all(
      topReposRaw.map((repo) => fetchRepoLanguages(repo.languages_url))
    );

    const languages: LanguageBytes = {};
    languageResults.forEach((langBytes) => {
      for (const [lang, bytes] of Object.entries(langBytes)) {
        languages[lang] = (languages[lang] || 0) + bytes;
      }
    });

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    const topRepos = topReposRaw.map((repo, index) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics,
      updated_at: repo.updated_at,
      languages: languageResults[index],
    }));

    const response = {
      public_repos: githubUser.public_repos,
      followers: githubUser.followers,
      following: githubUser.following,
      total_stars: totalStars,
      top_repos: topRepos,
      languages,
      avatar_url: githubUser.avatar_url,
      name: githubUser.name,
    };
    setCache(githubUsername, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}