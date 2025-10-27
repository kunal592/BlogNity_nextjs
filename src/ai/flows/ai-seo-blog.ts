
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

interface BlogGenerationParams {
  topic: string;
  keywords: string[];
}

export async function aiSEOBlogFlow(params: BlogGenerationParams) {
  const { topic, keywords } = params;

  // 1. Generate SEO-optimized title
  const titleGenerationPrompt = `Generate an SEO-optimized title for a blog post about "${topic}" with the following keywords: ${keywords.join(', ')}.`;
  const { text: optimizedTitle } = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    prompt: titleGenerationPrompt,
  });

  // 2. Generate blog content
  const contentGenerationPrompt = `Write a comprehensive blog post titled "${optimizedTitle}" about "${topic}". Incorporate the following keywords naturally: ${keywords.join(', ')}.`;
  const { text: optimizedContent } = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    prompt: contentGenerationPrompt,
  });

  // 3. Generate meta description
  const metaDescriptionPrompt = `Generate a meta description (under 160 characters) for a blog post titled "${optimizedTitle}" about "${topic}".`;
  const { text: metaDescription } = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    prompt: metaDescriptionPrompt,
  });

  return { optimizedTitle, optimizedContent, metaDescription };
}
