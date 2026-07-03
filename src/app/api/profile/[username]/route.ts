import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const profile = await db.profile.findUnique({
      where: { username },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const followerCount = await db.follow.count({ where: { followingId: profile.id } });
    const followingCount = await db.follow.count({ where: { followerId: profile.id } });

    const endorsements = await db.endorsement.groupBy({
      by: ['skill'],
      where: { profileId: profile.id },
      _count: { skill: true },
    });

    // Check if the current viewer (if any) has endorsed any skills
    const payload = getUserFromRequest(request);
    let myEndorsedSkills = new Set<string>();
    if (payload) {
      const myEndorsements = await db.endorsement.findMany({
        where: { profileId: profile.id, endorsedBy: payload.userId },
        select: { skill: true },
      });
      myEndorsedSkills = new Set(myEndorsements.map((e) => e.skill));
    }

    const skillsParsed = JSON.parse(profile.skills) as string[];
    const endorsementsArr = skillsParsed.map((skill) => {
      const found = endorsements.find((e) => e.skill === skill);
      return {
        skill,
        count: found ? found._count.skill : 0,
        endorsedByMe: myEndorsedSkills.has(skill),
      };
    });

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.userId,
        username: profile.username,
        bio: profile.bio,
        location: profile.location,
        githubUsername: profile.githubUsername,
        skills: skillsParsed,
        lookingFor: profile.lookingFor,
        createdAt: profile.createdAt,
        followerCount,
        followingCount,
        endorsements: endorsementsArr,
      },
      name: profile.user.name,
    });
  } catch (error) {
    console.error('Profile by username error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}