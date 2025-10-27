
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import ExclusivePageClient from "./ExclusivePageClient";

async function getExclusivePosts(isSubscribed: boolean) {
    const exclusivePosts = await db.post.findMany({
        where: {
            exclusive: true,
            status: 'PUBLISHED',
        },
        include: {
            author: {
                select: {
                    name: true,
                    profileImage: true,
                },
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },
        },
    });

    if (isSubscribed) {
        return exclusivePosts;
    } else {
        return exclusivePosts.map(post => ({
            ...post,
            content: post.content.substring(0, 200) + '...',
        }));
    }
}

export default async function ExclusivePage() {
    const session = await getServerSession(authOptions);
    const isSubscribed = session?.user?.subscription === "PREMIUM";
    const posts = await getExclusivePosts(isSubscribed);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Exclusive Content</h1>
            <ExclusivePageClient posts={posts} isSubscribed={isSubscribed} />
        </div>
    );
}
