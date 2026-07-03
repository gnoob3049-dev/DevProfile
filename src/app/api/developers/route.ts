import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill') || '';
    const search = searchParams.get('search') || '';
    const lookingFor = searchParams.get('lookingFor') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: Record<string, unknown> = {};

    if (skill) {
      where.skills = { contains: skill };
    }

    if (lookingFor) {
      where.lookingFor = { contains: lookingFor };
    }

    if (search) {
      where.OR = [
        { username: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    const total = await db.profile.count({ where });

    const profiles = await db.profile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const developers = await Promise.all(
      profiles.map(async (profile) => {
        const followerCount = await db.follow.count({
          where: { followingId: profile.id },
        });
        const followingCount = await db.follow.count({
          where: { followerId: profile.id },
        });

        return {
          ...profile,
          skills: JSON.parse(profile.skills) as string[],
          followerCount,
          followingCount,
        };
      })
    );

    return NextResponse.json({
      developers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Developers list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}