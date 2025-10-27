
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { Post, User } from '@prisma/client';

export async function updateUser(userId: string, data: Partial<User>) {
  try {
    await db.user.update({
      where: { id: userId },
      data,
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to update user' };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete user' };
  }
}

export async function updatePost(postId: string, data: Partial<Post>) {
  try {
    await db.post.update({
      where: { id: postId },
      data,
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to update post' };
  }
}

export async function deletePost(postId: string) {
  try {
    await db.post.delete({
      where: { id: postId },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to delete post' };
  }
}

export async function resolveQuery(queryId: string) {
  try {
    await db.contactMessage.update({
      where: { id: queryId },
      data: { status: 'resolved' },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to resolve query' };
  }
}

export async function resolveReport(commentId: string) {
  try {
    await db.comment.update({
      where: { id: commentId },
      data: { reported: false },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false, message: 'Failed to resolve report' };
  }
}
