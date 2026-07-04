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

    const following = await db.follow.findMany({
      where: { followerId: profile.id },
      include: {
        following: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    const users = following.map((f) => ({
      id: f.following.user.id,
      name: f.following.user.name,
      username: f.following.username,
      githubUsername: f.following.githubUsername,
      bio: f.following.bio,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Get following error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}