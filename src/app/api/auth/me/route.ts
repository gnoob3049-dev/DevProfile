import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: payload.userId },
    });

    return NextResponse.json({ user, profile });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}