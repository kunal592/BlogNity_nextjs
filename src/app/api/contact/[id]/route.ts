
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.contact.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
