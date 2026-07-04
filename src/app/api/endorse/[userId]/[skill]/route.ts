import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; skill: string }> }
) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, skill: encodedSkill } = await params;
    const skill = decodeURIComponent(encodedSkill);

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    try {
      await db.endorsement.create({
        data: {
          profileId: profile.id,
          skill,
          endorsedBy: payload.userId,
        },
      });
    } catch (createErr: unknown) {
      if (
        createErr &&
        typeof createErr === 'object' &&
        'code' in createErr &&
        (createErr as { code: string }).code === 'P2002'
      ) {
        // Already endorsed - return current count
        const endorsementCount = await db.endorsement.count({
          where: { profileId: profile.id, skill },
        });
        return NextResponse.json({ success: true, skill, count: endorsementCount });
      }
      throw createErr;
    }

    const endorsementCount = await db.endorsement.count({
      where: { profileId: profile.id, skill },
    });

    return NextResponse.json({ success: true, skill, count: endorsementCount });
  } catch (error) {
    console.error('Endorse error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}