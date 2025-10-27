
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { NotificationType } from '@prisma/client';

const likeSchema = z.object({
  postId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUserId = session.user.id;
    const data = await req.json();
    const validatedData = likeSchema.parse(data);

    // Check if the user has already liked the post
    const existingLike = await db.like.findUnique({
      where: {
        postId_userId: {
          postId: validatedData.postId,
          userId: currentUserId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'You have already liked this post' }, { status: 400 });
    }

    const newLike = await db.like.create({
      data: {
        postId: validatedData.postId,
        userId: currentUserId,
      },
      include: {
        post: {
          select: {
            authorId: true,
          }
        }
      }
    });

    if (newLike.post.authorId !== currentUserId) {
        await db.notification.create({
            data: {
                recipientId: newLike.post.authorId,
                actorId: currentUserId,
                type: NotificationType.LIKE,
                entityType: 'POST',
                entityId: newLike.postId,
            }
        })
    }


    return NextResponse.json(newLike, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating like:', error);
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
    const validatedData = likeSchema.parse(data);

    await db.like.delete({
      where: {
        postId_userId: {
          postId: validatedData.postId,
          userId: currentUserId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error deleting like:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
