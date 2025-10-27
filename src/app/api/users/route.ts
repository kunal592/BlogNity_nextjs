
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
