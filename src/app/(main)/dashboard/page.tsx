
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const posts = await db.post.findMany({
    where: {
      authorId: session.user.id,
    },
  });

  const totalViews = posts.reduce((sum, post) => sum + post.viewsCount, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);
  const totalComments = posts.reduce(
    (sum, post) => sum + post.commentsCount,
    0
  );

  return (
    <DashboardClient
      posts={posts}
      totalViews={totalViews}
      totalLikes={totalLikes}
      totalComments={totalComments}
    />
  );
}
