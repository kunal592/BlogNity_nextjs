
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { NotificationType } from '@prisma/client';

const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1, 'Content is required'),
  parentId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentUserId = session.user.id;
    const data = await req.json();
    const validatedData = commentSchema.parse(data);

    const newComment = await db.comment.create({
      data: {
        postId: validatedData.postId,
        authorId: currentUserId,
        content: validatedData.content,
        parentId: validatedData.parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        post: {
            select: {
                authorId: true,
            }
        },
        parent: {
            select: {
                authorId: true,
            }
        }
      },
    });

    // Increment the commentsCount on the post
    await db.post.update({
      where: { id: validatedData.postId },
      data: { commentsCount: { increment: 1 } },
    });

    // Notify post author
    if (newComment.post.authorId !== currentUserId) {
        await db.notification.create({
            data: {
                recipientId: newComment.post.authorId,
                actorId: currentUserId,
                type: NotificationType.COMMENT,
                entityType: 'POST',
                entityId: validatedData.postId,
            }
        });
    }

    // Notify parent comment author
    if (newComment.parentId && newComment.parent && newComment.parent.authorId !== currentUserId) {
        if (newComment.parent.authorId !== newComment.post.authorId) {
            await db.notification.create({
                data: {
                    recipientId: newComment.parent.authorId,
                    actorId: currentUserId,
                    type: NotificationType.COMMENT,
                    entityType: 'COMMENT',
                    entityId: newComment.id,
                },
            });
        }
    }

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating comment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
