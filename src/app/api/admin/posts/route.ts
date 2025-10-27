
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
        return null;
    }

    const user = await db.user.findUnique({
        where: { id: currentUserId },
    });

    if (!user?.isAdmin) {
        return null;
    }

    return user;
}

export async function GET(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const posts = await db.post.findMany();
    return NextResponse.json(posts);

  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const updatePostSchema = z.object({
    postId: z.string(),
    data: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
        visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE']).optional(),
    })
});

export async function PATCH(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = updatePostSchema.parse(body);

    const updatedPost = await db.post.update({
      where: { id: validatedData.postId },
      data: validatedData.data,
    });

    return NextResponse.json(updatedPost);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const deletePostSchema = z.object({
    postId: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = deletePostSchema.parse(body);

    await db.post.delete({
      where: { id: validatedData.postId },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error deleting post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
