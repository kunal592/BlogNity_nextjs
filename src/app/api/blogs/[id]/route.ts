
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        tags: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // You should add authentication and authorization here to ensure only the author or an admin can delete the post
    await db.post.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
