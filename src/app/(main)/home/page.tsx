
import { Suspense } from 'react';
import HomePageClient from './HomePageClient';
import { getPosts } from '@/lib/api';
import type { BlogView } from '@/lib/types';

const POSTS_PER_PAGE = 6;

export default async function HomePage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const view = (searchParams.view as BlogView) || 'grid';
  const page = parseInt(searchParams.page as string, 10) || 1;

  try {
    const { posts, totalPages } = await getPosts({ page, limit: POSTS_PER_PAGE });
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <HomePageClient initialPosts={posts} totalPages={totalPages} view={view} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts. Please try again later.</div>;
  }
}
