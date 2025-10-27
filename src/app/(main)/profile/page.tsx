
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfilePageClient from './ProfilePageClient';
import FollowingPageClient from './FollowingPageClient';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Please log in to view your profile.</div>;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      bookmarkedPosts: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      following: {
        include: {
          following: true,
        },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center space-x-4 mb-8'>
        <Avatar className='w-24 h-24'>
          <AvatarImage src={user.image || 'https://github.com/shadcn.png'} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className='text-4xl font-bold'>{user.name}</h1>
          <p className='text-muted-foreground'>{user.email}</p>
        </div>
      </div>

      <ProfilePageClient user={user} />

      <div className="mt-8">
        <h2 className='text-2xl font-bold mb-4'>My Blogs</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {user.posts.map((post) => (
            <div key={post.id} className='border p-4 rounded-lg'>
              <h3 className='text-xl font-bold mb-2'>{post.title}</h3>
              <p className='text-muted-foreground'>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className='text-2xl font-bold mb-4'>Bookmarked</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {user.bookmarkedPosts.map((post) => (
            <div key={post.id} className='border p-4 rounded-lg'>
              <h3 className='text-xl font-bold mb-2'>{post.title}</h3>
              <p className='text-muted-foreground'>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className='text-2xl font-bold mb-4'>Following</h2>
        <FollowingPageClient following={user.following} userId={user.id} />
      </div>
    </div>
  );
}
