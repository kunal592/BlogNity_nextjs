
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USERS_USERID_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { ...values } = await req.json();

    if (!session || session.user.id !== params.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USERS_USERID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== params.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    return new NextResponse('User deleted', { status: 200 });
  } catch (error) {
    console.error('[USERS_USERID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
