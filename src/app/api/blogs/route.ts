
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@/lib/auth'; // Assuming you have a helper for session
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).optional(),
  excerpt: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  status: z.enum(['draft', 'published']).optional(),
  postId: z.string().optional(), // For updates
});

export async function POST(req: Request) {
  try {
    const session = await getAuth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = postSchema.parse(body);

    const { postId, ...data } = validatedData;

    if (postId) {
      // Update existing post
      const updatedPost = await db.post.update({
        where: { id: postId, authorId: session.user.id },
        data,
      });
      return NextResponse.json(updatedPost);
    } else {
      // Create new post
      const newPost = await db.post.create({
        data: { ...data, authorId: session.user.id },
      });
      return NextResponse.json(newPost);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error saving post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
