
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { NotificationType } from '@prisma/client';

const followSchema = z.object({
  userIdToFollow: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUserId = session.user.id;
    const data = await req.json();
    const validatedData = followSchema.parse(data);

    if (currentUserId === validatedData.userIdToFollow) {
      return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 });
    }

    // Check if the follow relationship already exists
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: validatedData.userIdToFollow,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: 'You are already following this user' }, { status: 400 });
    }

    const newFollow = await db.follow.create({
      data: {
        followerId: currentUserId,
        followingId: validatedData.userIdToFollow,
      },
    });

    // Create notification
    await db.notification.create({
        data: {
            recipientId: validatedData.userIdToFollow,
            actorId: currentUserId,
            type: NotificationType.FOLLOW,
            entityType: 'USER',
            entityId: currentUserId
        }
    })

    return NextResponse.json(newFollow, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error following user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUserId = session.user.id;
    const data = await req.json();
    const validatedData = followSchema.parse(data);

    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: validatedData.userIdToFollow,
        },
      },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error unfollowing user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
