
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from 'next-auth/react';

export async function POST(req: NextRequest) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { postId } = await req.json();
  const userId = session.user.id;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { bookmarkedPosts: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isBookmarked = user.bookmarkedPosts.some((post) => post.id === postId);

    let updatedUser;
    if (isBookmarked) {
      // Remove bookmark
      updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          bookmarkedPosts: {
            disconnect: { id: postId },
          },
        },
      });
    } else {
      // Add bookmark
      updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          bookmarkedPosts: {
            connect: { id: postId },
          },
        },
      });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
