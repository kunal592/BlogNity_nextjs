
import { defineFlow } from '@genkit-ai/flow';
import { generate } from '@genkit-ai/ai';
import * as z from 'zod';


export const aiSEOBlogFlow = defineFlow(
  {
    name: 'aiSEOBlogFlow',
    inputSchema: z.object({
      topic: z.string(),
      keywords: z.array(z.string()),
    }),
    outputSchema: z.object({
      optimizedTitle: z.string(),
      optimizedContent: z.string(),
      metaDescription: z.string(),
    }),
  },
  async (params) => {
    const { topic, keywords } = params;

    // 1. Generate SEO-optimized title
    const titleGenerationPrompt = `Generate an SEO-optimized title for a blog post about \"${topic}\" with the following keywords: ${keywords.join(', ')}.`;
    const titleResponse = await generate({
      prompt: titleGenerationPrompt,
      model: 'googleai/gemini-1.5-flash',
    });
    const optimizedTitle = titleResponse.text();

    // 2. Generate blog content
    const contentGenerationPrompt = `Write a comprehensive blog post titled \"${optimizedTitle}\" about \"${topic}\". Incorporate the following keywords naturally: ${keywords.join(', ')}.`;
    const contentResponse = await generate({
      prompt: contentGenerationPrompt,
      model: 'googleai/gemini-1.5-flash',
    });
    const optimizedContent = contentResponse.text();

    // 3. Generate meta description
    const metaDescriptionPrompt = `Generate a meta description (under 160 characters) for a blog post titled \"${optimizedTitle}\" about \"${topic}\".`;
    const metaDescriptionResponse = await generate({
      prompt: metaDescriptionPrompt,
      model: 'googleai/gemini-1.5-flash',
    });
    const metaDescription = metaDescriptionResponse.text();

    return { optimizedTitle, optimizedContent, metaDescription };
  },
);
