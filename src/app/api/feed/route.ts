
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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

    const followedUserIds = followedUsers.map((follow: { followingId: string }) => follow.followingId);

    // Fetch posts from those followed users
    const feedPosts = await db.post.findMany({
      where: {
        authorId: {
          in: followedUserIds,
        },
        status: 'PUBLISHED', // Only show published posts in the feed
      },
      include: {
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
      take: 20, // Paginate the results
    });

    return NextResponse.json(feedPosts);

  } catch (error) {
    console.error('Error fetching feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
