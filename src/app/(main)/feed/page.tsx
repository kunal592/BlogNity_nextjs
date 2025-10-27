import { getPosts, getCurrentUser, getUsers } from '@/lib/api';
import FeedPageClient from './FeedPageClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function FeedPage() {
  const { data: allPosts } = await getPosts({limit: 1000});
  const allUsers = await getUsers();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Please log in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Log in to see your personalized feed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
