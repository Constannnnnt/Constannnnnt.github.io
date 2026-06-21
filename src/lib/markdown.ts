import yaml from 'js-yaml';

export interface BlogPostData {
    slug: string;
    frontmatter: {
        title?: string;
        date?: string;
        description?: string;
        tags?: string[];
        [key: string]: any;
    };
    content: string;
}

export const fetchBlogPost = async (path: string): Promise<BlogPostData> => {
    try {
        const fullPath = path.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
        const response = await fetch(fullPath);
        if (!response.ok) {
            throw new Error(`Failed to fetch blog post: ${response.statusText}`);
        }
        const text = await response.text();

        // Manual frontmatter parsing with support for CRLF and LF
        const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

        if (match) {
            const frontmatterRaw = match[1];
            const content = match[2];
            const frontmatter = yaml.load(frontmatterRaw) as Record<string, any>;

            const slug = path.split('/').pop()?.replace('.md', '') || '';

            return {
                slug,
                frontmatter,
                content: content.trim(),
            };
        } else {
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            return {
                slug,
                frontmatter: {},
                content: text
            };
        }
    } catch (error) {
        console.error("Error loading blog post:", error);
        throw error;
    }
};
