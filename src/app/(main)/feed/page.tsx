import { getPosts, getCurrentUser, getUsers } from '@/lib/api';
import FeedPageClient from './FeedPageClient';

export default async function FeedPage() {
  const { data: allPosts } = await getPosts({limit: 1000});
  const allUsers = await getUsers();
  const currentUser = await getCurrentUser();

  let feedPostsWithAuthors = [];

  if (currentUser && currentUser.followingUsers) {
    const followedUserIds = currentUser.followingUsers.map(user => user.id);
    const feedPosts = allPosts.filter(post => followedUserIds.includes(post.authorId));

    feedPostsWithAuthors = feedPosts.map(post => {
      const author = allUsers.find(u => u.id === post.authorId);
      return { ...post, author };
    });
  }

  return (
    <FeedPageClient initialPosts={feedPostsWithAuthors} />
  );
}
