
export const toggleLike = async (postId: string, userId: string) => {
  const response = await fetch('/api/likes', {
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
  const response = await fetch('/api/bookmark', {
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
