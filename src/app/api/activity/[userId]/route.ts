import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Get the profile for this userId
    const targetProfile = await db.profile.findUnique({
      where: { userId },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get recent followers (people who followed this user)
    const recentFollows = await db.follow.findMany({
      where: { followingId: targetProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        follower: {
          include: { user: true },
        },
      },
    });

    // Get recent endorsements
    const recentEndorsements = await db.endorsement.findMany({
      where: { profileId: targetProfile.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        profile: {
          include: { user: true },
        },
      },
    });

    // Get the endorsing user's profiles
    const endorserIds = recentEndorsements.map((e) => e.endorsedBy);
    const endorserProfiles = await db.profile.findMany({
      where: { userId: { in: endorserIds } },
      include: { user: true },
    });
    const endorserMap = new Map(endorserProfiles.map((p) => [p.userId, p]));

    // Merge activities
    const activities = [
      ...recentFollows.map((f) => ({
        type: 'follow' as const,
        id: f.id,
        actorName: f.follower.user.name,
        actorUsername: f.follower.username,
        actorGithubUsername: f.follower.githubUsername,
        createdAt: f.createdAt.toISOString(),
      })),
      ...recentEndorsements.map((e) => {
        const endorser = endorserMap.get(e.endorsedBy);
        return {
          type: 'endorse' as const,
          id: e.id,
          actorName: endorser?.user.name || 'Someone',
          actorUsername: endorser?.username || 'unknown',
          actorGithubUsername: endorser?.githubUsername || '',
          skill: e.skill,
          createdAt: e.createdAt.toISOString(),
        };
      }),
    ];

    // Sort by date descending
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Return top 30
    return NextResponse.json({ activities: activities.slice(0, 30) });
  } catch (error) {
    console.error('Activity fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}