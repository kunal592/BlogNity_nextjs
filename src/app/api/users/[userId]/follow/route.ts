
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alreadyFollowing = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: params.userId,
        },
      },
    });

    if (alreadyFollowing) {
      return new NextResponse('Already following', { status: 400 });
    }

    await db.follow.create({
      data: {
        followerId: session.user.id,
        followingId: params.userId,
      },
    });

    return new NextResponse('Followed user', { status: 200 });
  } catch (error) {
    console.error('[USERS_USERID_FOLLOW_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: params.userId,
        },
      },
    });

    return new NextResponse('Unfollowed user', { status: 200 });
  } catch (error) {
    console.error('[USERS_USERID_FOLLOW_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
