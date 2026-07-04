import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    if (payload.userId === userId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const followerProfile = await db.profile.findUnique({
      where: { userId: payload.userId },
    });

    const followingProfile = await db.profile.findUnique({
      where: { userId },
    });

    if (!followerProfile || !followingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await db.follow.create({
      data: {
        followerId: followerProfile.id,
        followingId: followingProfile.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Follow error:', error);
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ error: 'Already following' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    if (payload.userId === userId) {
      return NextResponse.json({ error: 'Cannot unfollow yourself' }, { status: 400 });
    }

    const followerProfile = await db.profile.findUnique({
      where: { userId: payload.userId },
    });

    const followingProfile = await db.profile.findUnique({
      where: { userId },
    });

    if (!followerProfile || !followingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await db.follow.deleteMany({
      where: {
        followerId: followerProfile.id,
        followingId: followingProfile.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}