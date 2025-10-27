
import { getAbsoluteApiUrl } from './utils';

const API_URL = getAbsoluteApiUrl();

export const toggleLike = async (postId: string, userId: string) => {
  const response = await fetch(`${API_URL}/api/likes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }
  return response.json();
};

export const toggleBookmark = async (postId: string, userId: string) => {
  const response = await fetch(`${API_URL}/api/bookmark`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId }),
  });
  if (!response.ok) {
    throw new Error('Failed to toggle bookmark');
  }
  return response.json();
};

export const getPosts = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/api/blogs?${query}`);
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
};

export const getUsers = async () => {
    const response = await fetch(`${API_URL}/api/users`);
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
};

export const getCurrentUser = async () => {
    const response = await fetch(`${API_URL}/api/users/me`);
    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
        throw new Error("Failed to fetch current user");
    }
    return response.json();
};

export const getNotifications = async () => {
    const response = await fetch(`${API_URL}/api/notifications`);
    if (response.status === 401) {
      return [];
    }
    if (!response.ok) {
        throw new Error("Failed to fetch notifications");
    }
    return response.json();
};
