'use client';

import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import type { Post, User } from '@/lib/types';

interface BlogListProps {
  posts: (Post & { author?: User })[];
  viewMode: 'grid' | 'list';
}

export default function BlogList({ posts, viewMode }: BlogListProps) {
  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <BlogCardList key={post.id} post={post} author={post.author} />
          ))}
        </div>
      )}
    </>
  );
}
