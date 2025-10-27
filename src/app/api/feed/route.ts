
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(search_params.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const currentUserId = session.user.id;

    const whereClause = {
      author: {
        receivedFollows: {
          some: {
            followerId: currentUserId,
          },
        },
      },
      status: 'PUBLISHED',
    };

    const [feedPosts, totalPosts] = await Promise.all([
        db.post.findMany({
            where: whereClause,
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
            skip,
            take: limit,
        }),
        db.post.count({ where: whereClause })
    ]);

    if (feedPosts.length === 0) {
      return NextResponse.json({
        message: "Your feed is empty. Follow some users to see their posts here.",
        data: [],
        pagination: {
            total: 0,
            page: 1,
            limit,
            totalPages: 0,
        }
      });
    }

    return NextResponse.json({
        data: feedPosts,
        pagination: {
            total: totalPosts,
            page,
            limit,
            totalPages: Math.ceil(totalPosts / limit),
        }
    });

  } catch (error) {
    console.error('Error fetching feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
