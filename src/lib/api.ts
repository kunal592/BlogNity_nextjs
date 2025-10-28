
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

export const handleSeoOptimize = async (title: string, content: string, tags: string) => {
  const response = await fetch('/api/ai/generate-blog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Optimize the following blog post for SEO. Title: ${title}. Content: ${content}. Keywords: ${tags}.`,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to optimize post');
  }

  return response.json();
};

export const handleSummarize = async (content: string) => {
    const response = await fetch(`${API_URL}/api/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to summarize content");
    }
    return response.json();
};

export const handleGenerate = async (prompt: string) => {
    const response = await fetch(`${API_URL}/api/ai/generate-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate blog content");
    }
    return response.json();
};
