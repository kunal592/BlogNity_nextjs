
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

    const messages = await db.contactMessage.findMany();
    return NextResponse.json(messages);

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const deleteMessageSchema = z.object({
    messageId: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = deleteMessageSchema.parse(body);

    await db.contactMessage.delete({
      where: { id: validatedData.messageId },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error deleting contact message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
