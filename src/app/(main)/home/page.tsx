
import { Suspense } from 'react';
import HomePageClient from './HomePageClient';
import { fetchPublicBlogs } from '@/lib/data/blog';
import type { BlogView } from '@/lib/types';

const POSTS_PER_PAGE = 6;

async function BlogFeed({ view, page }: { view: BlogView; page: number }) {
  try {
    const { posts, totalPages } = await fetchPublicBlogs(page, POSTS_PER_PAGE);
    return <HomePageClient initialPosts={posts} totalPages={totalPages} view={view} />;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts. Please try again later.</div>;
  }
}

export default function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const view = (searchParams.view as BlogView) || 'grid';
  const page = parseInt(searchParams.page as string, 10) || 1;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogFeed view={view} page={page} />
    </Suspense>
  );
}
