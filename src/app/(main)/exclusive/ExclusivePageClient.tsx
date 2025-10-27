'use client';

import { Post } from "@/lib/types";

interface ExclusivePageClientProps {
    posts: Post[];
    isSubscribed: boolean;
}

export default function ExclusivePageClient({ posts, isSubscribed }: ExclusivePageClientProps) {
    return (
        <div>
            {isSubscribed ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Render full post cards for subscribed users */}
                    {posts.map(post => (
                        <div key={post.id} className="border p-4 rounded-lg">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p>{post.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Unlock Exclusive Content</h2>
                    <p className="mb-8">Subscribe now to access all exclusive posts and support our work.</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Subscribe Now
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        {/* Render preview post cards for non-subscribed users */}
                        {posts.map(post => (
                            <div key={post.id} className="border p-4 rounded-lg">
                                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                                <p>{post.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
