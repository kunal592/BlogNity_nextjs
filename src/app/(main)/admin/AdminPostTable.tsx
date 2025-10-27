'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post, User } from '@prisma/client';
import { Archive, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { deletePost, updatePost } from './actions';

interface AdminPostTableProps {
  posts: (Post & { author: User })[];
}

export default function AdminPostTable({ posts }: AdminPostTableProps) {
    const { toast } = useToast();

    const handleFeature = async (post: Post) => {
        const result = await updatePost(post.id, { isFeatured: !post.isFeatured });
        if (result.success) {
            toast({ title: `Post has been ${!post.isFeatured ? 'featured' : 'unfeatured'}` });
        } else {
            toast({ title: 'Failed to update post.', variant: 'destructive' });
        }
    };

    const handleArchive = async (post: Post) => {
        const result = await updatePost(post.id, { status: post.status === 'ARCHIVED' ? 'PUBLISHED' : 'ARCHIVED' });
        if (result.success) {
            toast({ title: `Post has been ${post.status === 'ARCHIVED' ? 'unarchived' : 'archived'}` });
        } else {
            toast({ title: 'Failed to update post.', variant: 'destructive' });
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const result = await deletePost(postId);
        if (result.success) {
            toast({ title: 'Post deleted successfully' });
        } else {
            toast({ title: 'Failed to delete post', variant: 'destructive' });
        }
    };

    const handleToggleExclusive = async (post: Post) => {
        const result = await updatePost(post.id, { exclusive: !post.exclusive });
        if (result.success) {
            toast({ title: `Post is now ${!post.exclusive ? 'exclusive' : 'public'}` });
        } else {
            toast({ title: 'Failed to update post.', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Exclusive</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map(post => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                                <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>{post.status}</Badge>
                            </TableCell>
                             <TableCell>
                                <Switch
                                    checked={post.exclusive}
                                    onCheckedChange={() => handleToggleExclusive(post)}
                                    aria-label="Toggle exclusive status"
                                />
                            </TableCell>
                            <TableCell>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleFeature(post)}><Star className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleArchive(post)}><Archive className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
