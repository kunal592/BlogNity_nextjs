
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = contactSchema.parse(data);

    const newMessage = await db.contactMessage.create({
      data: validatedData,
    });

    return NextResponse.json(newMessage, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating contact message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
