import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio, location, githubUsername, skills, lookingFor } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const skillsString = JSON.stringify(skills || []);

    const profile = await db.profile.upsert({
      where: { userId: payload.userId },
      update: {
        username,
        bio: bio || '',
        location: location || '',
        githubUsername: githubUsername || '',
        skills: skillsString,
        lookingFor: lookingFor || '',
      },
      create: {
        userId: payload.userId,
        username,
        bio: bio || '',
        location: location || '',
        githubUsername: githubUsername || '',
        skills: skillsString,
        lookingFor: lookingFor || '',
      },
    });

    const skillsParsed = JSON.parse(profile.skills) as string[];
    const followerCount = await db.follow.count({ where: { followingId: profile.id } });
    const followingCount = await db.follow.count({ where: { followerId: profile.id } });

    const endorsements = await db.endorsement.groupBy({
      by: ['skill'],
      where: { profileId: profile.id },
      _count: { skill: true },
    });

    const endorsementsArr = skillsParsed.map((skill) => {
      const found = endorsements.find((e) => e.skill === skill);
      return { skill, count: found ? found._count.skill : 0, endorsedByMe: false };
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
    });
  } catch (error) {
    console.error('Profile create/update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: payload.userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
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

    // Check which skills the current user has endorsed
    const myEndorsements = await db.endorsement.findMany({
      where: { profileId: profile.id, endorsedBy: payload.userId },
      select: { skill: true },
    });
    const myEndorsedSkills = new Set(myEndorsements.map((e) => e.skill));

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
    });
  } catch (error) {
    console.error('Profile get error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}