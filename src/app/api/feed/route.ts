
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

const DEFAULT_FEED_LIMIT = 20;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUserId = session.user.id;

    // Find IDs of users the current user is following
    const followedUsers = await db.follow.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followedUserIds = followedUsers.map((follow) => follow.followingId);

    // Fetch posts from those followed users
    const feedPosts = await db.post.findMany({
      where: {
        authorId: {
          in: followedUserIds,
        },
        status: 'PUBLISHED', // Only show published posts in the feed
      },
      select: {
        id: true,
        title: true,
        content: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: DEFAULT_FEED_LIMIT, // Paginate the results
    });

    return NextResponse.json(feedPosts);

  } catch (error) {
    console.error('Error fetching feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
