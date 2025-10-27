
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

    const users = await db.user.findMany();
    return NextResponse.json(users);

  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const updateUserSchema = z.object({
    userId: z.string(),
    data: z.object({
        email: z.string().email().optional(),
        username: z.string().optional(),
        name: z.string().optional(),
        bio: z.string().optional(),
        isAdmin: z.boolean().optional(),
    })
});

export async function PATCH(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: validatedData.userId },
      data: validatedData.data,
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

const deleteUserSchema = z.object({
    userId: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const adminUser = await checkAdmin();
    if (!adminUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedData = deleteUserSchema.parse(body);

    await db.user.delete({
      where: { id: validatedData.userId },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error deleting user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
