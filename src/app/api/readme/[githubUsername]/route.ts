import { NextResponse } from 'next/server';
import { getFromCache, setCache } from '@/lib/github-cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ githubUsername: string }> }
) {
  try {
    const { githubUsername } = await params;
    const cacheKey = `readme-${githubUsername}`;
    const cached = getFromCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    const res = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=stars&direction=desc&per_page=100`,
      {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
    }

    const repos = await res.json();

    // Get the top repo by stars (or the one matching their username)
    const topRepo = repos.reduce((best: typeof repos[0] | null, repo: typeof repos[0]) => {
      if (!best) return repo;
      // Prefer repo that matches the username
      if (repo.name.toLowerCase() === githubUsername.toLowerCase()) return repo;
      if (repo.stargazers_count > best.stargazers_count) return repo;
      return best;
    }, null as typeof repos[0] | null);

    if (!topRepo || !topRepo.has_readme) {
      setCache(cacheKey, { readme: null, repoName: null });
      return NextResponse.json({ readme: null, repoName: null });
    }

    // Fetch the README
    const readmeRes = await fetch(
      `https://api.github.com/repos/${githubUsername}/${topRepo.name}/readme`,
      {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!readmeRes.ok) {
      setCache(cacheKey, { readme: null, repoName: topRepo.name });
      return NextResponse.json({ readme: null, repoName: topRepo.name });
    }

    const readmeData = await readmeRes.json();
    const readme = Buffer.from(readmeData.content, 'base64').toString('utf-8');

    const result = { readme, repoName: topRepo.name, repoUrl: topRepo.html_url };
    setCache(cacheKey, result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('README fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch README' }, { status: 500 });
  }
}