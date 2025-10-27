
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

interface BlogSummarizationParams {
  title: string;
  content: string;
}

export async function aiSummarizeBlogFlow(params: BlogSummarizationParams) {
  const { title, content } = params;

  const summarizationPrompt = `Summarize the following blog post titled "${title}":\n\n${content}`;
  const { text: summarizedContent } = await generateText({
    model: google('models/gemini-1.5-pro-latest'),
    prompt: summarizationPrompt,
  });

  return { summarizedContent };
}
