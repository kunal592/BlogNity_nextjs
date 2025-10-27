
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import AdminPageClient from './AdminPageClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center">
        <p className="text-xl text-muted-foreground">
          You are not authorized to view this page.
        </p>
      </div>
    );
  }

  const users = await db.user.findMany();
  const posts = await db.post.findMany({
    include: {
      author: true,
      likes: true,
      comments: true,
    },
  });
  const queries = await db.contactMessage.findMany();
  const reportedComments = await db.comment.findMany({
    where: {
      reported: true
    },
    include: {
      author: true,
      post: true
    }
  });

  return <AdminPageClient users={users} posts={posts} queries={queries} reportedComments={reportedComments} />;
}
