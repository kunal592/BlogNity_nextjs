
import { getPosts } from '@/lib/api';
import HomePageClient from './HomePageClient';

export default async function HomePage({ searchParams }: { searchParams: { page?: string, view?: string } }) {
  const page = parseInt(searchParams.page || '1', 10);
  const view = searchParams.view || 'grid';

  const { data: posts, meta: pagination } = await getPosts({ page: page, limit: 10 });

  return (
    <div className="container mx-auto">
      <HomePageClient initialPosts={posts} totalPages={pagination.totalPages} view={view} />
    </div>
  );
}
