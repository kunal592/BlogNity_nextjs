
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, content, tags, excerpt, thumbnailUrl } = await req.json();

    const newPost = await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        status: 'DRAFT',
        tags: {
          create: tags.map((tag: string) => ({ tag: { connectOrCreate: { where: { name: tag }, create: { name: tag, slug: tag } } } }))
        },
        excerpt,
        thumbnailUrl,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating draft:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
