'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { Comment, User, Post } from '@prisma/client';
import { resolveReport } from './actions';

interface ReportedCommentsTableProps {
  comments: (Comment & { author: User, post: Post })[];
}

export default function ReportedCommentsTable({ comments }: ReportedCommentsTableProps) {
    const { toast } = useToast();

    const handleResolve = async (id: string) => {
        const result = await resolveReport(id);
        if (result.success) {
            toast({ title: 'Report resolved.' });
        } else {
            toast({ title: 'Failed to resolve report.', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Comment</TableHead>
                        <TableHead>Post</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comments.map(comment => (
                        <TableRow key={comment.id}>
                            <TableCell className="max-w-sm truncate">{comment.content}</TableCell>
                            <TableCell>{comment.post.title}</TableCell>
                            <TableCell>{comment.author.name}</TableCell>
                            <TableCell>{format(new Date(comment.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleResolve(comment.id)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Resolve Report
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
