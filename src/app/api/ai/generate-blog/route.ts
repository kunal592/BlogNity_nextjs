
import { NextResponse } from 'next/server';
import { aiSEOBlogFlow } from '@/ai/flows/ai-seo-blog';
import { z } from 'zod';

const generateBlogSchema = z.object({
  topic: z.string(),
  keywords: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedData = generateBlogSchema.parse(data);

    const { optimizedTitle, optimizedContent, metaDescription } = await aiSEOBlogFlow(validatedData);

    return NextResponse.json({ optimizedTitle, optimizedContent, metaDescription });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error generating blog:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
