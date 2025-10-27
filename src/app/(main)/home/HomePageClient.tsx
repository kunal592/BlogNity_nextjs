'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ViewToggle from './ViewToggle';
import BlogList from './BlogList';
import { Button } from '@/components/ui/button';

export default function HomePageClient({ initialPosts, totalPages: initialTotalPages, view: initialView }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState(initialView || 'grid');

  const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);

  const handleViewChange = (view) => {
    setViewMode(view);
    router.push(`/?view=${view}&page=${currentPage}`);
  };

  const handlePageChange = (newPage) => {
    router.push(`/?view=${viewMode}&page=${newPage}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Latest Posts</h1>
        <ViewToggle viewMode={viewMode} setViewMode={handleViewChange} />
      </div>
      <BlogList posts={initialPosts} viewMode={viewMode} />
      <div className="flex justify-center items-center mt-8">
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {initialTotalPages}
        </span>
        <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= initialTotalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
