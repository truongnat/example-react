// src/routes/posts.tsx
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import React from 'react';

export const Route = createFileRoute('/posts')({
  component: Posts,
  loader: async () => {
    const posts: any[] = [];
    return {
      posts,
    }
  },
})

function Posts() {
  const { posts } = Route.useLoaderData()
  return (
    <div>
      <nav>
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            params={{ postId: post.id }}
          >
            {post.title}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
