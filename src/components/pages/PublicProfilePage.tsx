'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore, type GitHubData, type ProfileData } from '@/store/app-store';
import { api } from '@/lib/api';
import { ProfileHeader } from '@/components/shared/ProfileHeader';
import { GitHubStatsCard } from '@/components/shared/GitHubStatsCard';
import { RepoCard } from '@/components/shared/RepoCard';
import { LanguageChart } from '@/components/shared/LanguageChart';
import { EndorsementsSection } from '@/components/shared/EndorsementsSection';

export function PublicProfilePage() {
  const { routeParams, user, navigate } = useAppStore();
  const username = routeParams.username || '';
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [ghData, setGhData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ghLoading, setGhLoading] = useState(true);
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    if (!username) return;
    api.getProfile(username)
      .then((data) => {
        setProfile(data.profile);
        setOwnerName(data.name || data.profile.username);
        if (data.profile.githubUsername) {
          api.getGitHubData(data.profile.githubUsername)
            .then((gh) => setGhData(gh))
            .catch(() => {})
            .finally(() => setGhLoading(false));
        } else {
          setGhLoading(false);
        }
      })
      .catch(() => { navigate('landing'); })
      .finally(() => setLoading(false));
  }, [username, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-48 rounded-2xl bg-white/5" />
        <Skeleton className="h-32 rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!profile) return null;

  const isOwn = user?.id === profile.userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <ProfileHeader profile={profile} name={ownerName} isOwn={isOwn} />

      {ghLoading ? (
        <Skeleton className="h-32 rounded-2xl bg-white/5" />
      ) : ghData ? (
        <GitHubStatsCard data={ghData} />
      ) : null}

      {ghData && ghData.top_repos.length > 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Top Repositories</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {ghData.top_repos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))}
          </div>
        </div>
      )}

      {ghData && Object.keys(ghData.languages).length > 0 && (
        <LanguageChart languages={ghData.languages} />
      )}

      {profile.githubUsername && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Contribution Activity</h3>
          <div className="overflow-x-auto">
            <img
              src={`https://ghchart.rshah.org/${profile.githubUsername}`}
              alt="GitHub Contributions"
              className="w-full max-w-full"
              style={{ filter: 'invert(1) hue-rotate(180deg)' }}
            />
          </div>
        </div>
      )}

      {profile.endorsements && profile.endorsements.length > 0 && (
        <EndorsementsSection endorsements={profile.endorsements} profileUserId={profile.userId} />
      )}
    </div>
  );
}