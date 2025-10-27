
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { User } from '@prisma/client';
import { updateUser, deleteUser } from './actions';

interface AdminUserTableProps {
  users: User[];
}

export default function AdminUserTable({ users }: AdminUserTableProps) {
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, isAdmin: boolean) => {
    const result = await updateUser(userId, { isAdmin });
    if (result.success) {
      toast({ title: 'User role updated successfully' });
    } else {
      toast({ title: 'Failed to update user role', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const result = await deleteUser(userId);
    if (result.success) {
      toast({ title: 'User deleted successfully' });
    } else {
      toast({ title: 'Failed to delete user', variant: 'destructive' });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleRoleChange(user.id, !user.isAdmin)}
                  >
                    {user.isAdmin ? 'Make User' : 'Make Admin'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
