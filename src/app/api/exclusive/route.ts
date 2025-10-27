
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userIsSubscribed = session?.user?.subscription === true;

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

    if (userIsSubscribed) {
      return NextResponse.json(exclusivePosts);
    } else {
      const previewPosts = exclusivePosts.map(post => ({
        ...post,
        content: post.content.substring(0, 200) + '...', // Create a preview
      }));
      return NextResponse.json(previewPosts);
    }

  } catch (error) {
    console.error('Error fetching exclusive posts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
