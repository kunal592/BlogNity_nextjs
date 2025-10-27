'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactMessage } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { resolveQuery } from './actions';

interface ResolveQueriesTableProps {
  queries: ContactMessage[];
}

export default function ResolveQueriesTable({ queries }: ResolveQueriesTableProps) {
    const { toast } = useToast();

    const handleResolve = async (id: string) => {
        const result = await resolveQuery(id);
        if (result.success) {
            toast({ title: 'Query marked as resolved.' });
        } else {
            toast({ title: 'Failed to update query.', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {queries.map(query => (
                        <TableRow key={query.id}>
                            <TableCell>
                                <div className="font-medium">{query.name}</div>
                                <div className="text-sm text-muted-foreground">{query.email}</div>
                            </TableCell>
                            <TableCell className="max-w-sm truncate">{query.message}</TableCell>
                            <TableCell>{format(new Date(query.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                                <Badge variant={query.status === 'resolved' ? 'default' : 'secondary'}>
                                    {query.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {query.status !== 'resolved' && (
                                    <Button variant="ghost" size="sm" onClick={() => handleResolve(query.id)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Mark as Resolved
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
