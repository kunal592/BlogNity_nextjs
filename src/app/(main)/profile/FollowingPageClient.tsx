
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function FollowingPageClient({ following, userId }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleUnfollow = async (followingId: string) => {
    try {
      const response = await fetch(`/api/users/${followingId}/follow`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }

      toast({ title: 'User unfollowed successfully!' });
      router.refresh();
    } catch (error) {
      toast({ title: 'Failed to unfollow user.', variant: 'destructive' });
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {following.map((follow) => (
        <div key={follow.following.id} className='border p-4 rounded-lg flex items-center justify-between'>
          <div>
            <h3 className='text-xl font-bold mb-2'>{follow.following.name}</h3>
            <p className='text-muted-foreground'>{follow.following.email}</p>
          </div>
          <Button variant='destructive' onClick={() => handleUnfollow(follow.following.id)}>
            Unfollow
          </Button>
        </div>
      ))}
    </div>
  );
}
