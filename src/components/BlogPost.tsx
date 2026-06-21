import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPostData, fetchBlogPost } from '@/lib/markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPostProps {
  path: string;
}

export const BlogPost = ({ path }: BlogPostProps) => {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPost(path)
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load blog post');
        setLoading(false);
      });
  }, [path]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-2 pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <div className="text-destructive font-mono">{error || 'Post not found'}</div>;
  }

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none">
      <div className="mb-8 not-prose">
        <h1 className="text-3xl font-serif font-bold mb-4">{post.frontmatter.title || 'Untitled Post'}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono">
          {post.frontmatter.date && <time>{post.frontmatter.date}</time>}
          {post.frontmatter.tags && (
            <div className="flex gap-2">
              {post.frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-none border-foreground/50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {post.content}
      </ReactMarkdown>
    </article>
  );
};
