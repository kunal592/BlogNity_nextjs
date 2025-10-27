
import { getPosts, getUsers } from '@/lib/api';
import HomePageClient from './HomePageClient';

export default async function HomePage({ searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  const view = searchParams.view || 'grid';

  const { data: posts, pagination } = await getPosts(page, 10);

  return (
    <div className="container mx-auto">
      <HomePageClient initialPosts={posts} totalPages={pagination.totalPages} />
    </div>
  );
}
