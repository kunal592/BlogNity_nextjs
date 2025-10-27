
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import type { Post } from '@prisma/client';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userIsAdmin = session?.user?.role === 'ADMIN';

    const whereClause = {
      status: 'PUBLISHED',
    };

    const blogs = await db.post.findMany({
      skip,
      take: limit,
      where: whereClause,
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    const processedBlogs = blogs.map((blog: Post) => {
      if (blog.exclusive && !userIsAdmin) {
        return {
          ...blog,
          content: blog.content.substring(0, 200) + '...',
        };
      }
      return blog;
    });

    const totalBlogs = await db.post.count({ where: whereClause });

    return NextResponse.json({
      data: processedBlogs,
      meta: {
        total: totalBlogs,
        page,
        limit,
        totalPages: Math.ceil(totalBlogs / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // @ts-ignore
    const currentUserId = session.user.id;

    const data = await request.json();
    const validatedData = blogSchema.parse(data);

    const newBlog = await db.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        authorId: currentUserId,
        slug: validatedData.title.toLowerCase().replace(/\s+/g, '-'),
        tags: {
          connectOrCreate: validatedData.tags?.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') },
          })),
        },
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
