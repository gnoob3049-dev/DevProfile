import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const followers = await db.follow.findMany({
      where: { followingId: profile.id },
      include: {
        follower: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    const users = followers.map((f) => ({
      id: f.follower.user.id,
      name: f.follower.user.name,
      username: f.follower.username,
      githubUsername: f.follower.githubUsername,
      bio: f.follower.bio,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get followers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}