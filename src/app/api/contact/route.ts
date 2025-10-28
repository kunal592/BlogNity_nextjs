
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
