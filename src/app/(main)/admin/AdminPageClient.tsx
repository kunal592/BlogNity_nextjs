
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { User, Post, ContactMessage, Comment } from '@prisma/client';
import AdminUserTable from './AdminUserTable';
import AdminPostTable from './AdminPostTable';
import ResolveQueriesTable from './ResolveQueriesTable';
import AdminReportedCommentsTable from './AdminReportedCommentsTable';

interface AdminPageClientProps {
  users: User[];
  posts: Post[];
  queries: ContactMessage[];
  reportedComments: (Comment & { author: User; post: Post })[];
}

export default function AdminPageClient({
  users,
  posts,
  queries,
  reportedComments,
}: AdminPageClientProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="posts">Manage Posts</TabsTrigger>
          <TabsTrigger value="queries">Resolve Queries</TabsTrigger>
          <TabsTrigger value="reported-comments">Reported Comments</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <AdminUserTable users={users} />
        </TabsContent>
        <TabsContent value="posts">
          <AdminPostTable posts={posts} />
        </TabsContent>
        <TabsContent value="queries">
          <ResolveQueriesTable queries={queries} />
        </TabsContent>
        <TabsContent value="reported-comments">
          <AdminReportedCommentsTable comments={reportedComments} />
        </TabsContent>
        <TabsContent value="settings">
          <p>The site settings are not yet implemented. This feature will be available in a future update.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
