
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const exclusivePosts = await db.post.findMany({
      where: {
        exclusive: true,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
            profileImage: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(exclusivePosts);

  } catch (error) {
    console.error('Error fetching exclusive posts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
