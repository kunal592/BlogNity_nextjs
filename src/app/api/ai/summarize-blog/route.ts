
import { NextResponse } from 'next/server';
import { aiSummarizeBlogFlow } from '@/ai/flows/ai-summarize-blog';
import { z } from 'zod';

const summarizeBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = summarizeBlogSchema.parse(data);

    const { summarizedContent } = await aiSummarizeBlogFlow(validatedData);

    return NextResponse.json({ summarizedContent });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error summarizing blog:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
