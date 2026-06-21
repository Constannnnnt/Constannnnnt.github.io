import yaml from 'js-yaml';

export interface Profile {
    name: string;
    title: string;
    email: string;
    imageUrl: string;
    bio?: string;
    bioTooltip?: {
        paragraphIndex: number;
        highlightLabel: string;
        text: string;
        supervisors: Array<{
            name: string;
            url: string;
        }>;
    };
    social: {
        github?: string;
        twitter?: string;
        linkedin?: string;
        googleScholar?: string;
    };
}

export interface Publication {
    title: string;
    venue: string;
    tags: string[];
    authors: string;
    highlightAuthor?: string;
    imageUrl: string;
    gifUrl?: string;
    paperUrl?: string;
    videoUrl?: string;
    codeUrl?: string;
    summary: string[];
    categories: string[];
}

export interface Project {
    title: string;
    description: string;
    imageUrl: string;
    gifUrl?: string;
    tags: string[];
    link?: string;
    githubUrl?: string;
    videoUrl?: string;
    summary?: string[];
    blogUrl?: string;
}

export interface TimelineItem {
    date: string;
    startDate?: string;
    endDate?: string;
    title: string;
    subtitle: string;
    type: 'education' | 'work';
    description?: string;
}

export interface NewsItem {
    date: string;
    text: string;
    link?: string;
}

export interface BlogPost {
    slug: string;
    file: string;
    title: string;
    date: string;
}

export interface ResearchArea {
    id: string;
    sentence: string;
    animationType: string;
}

export interface Config {
    profile: Profile;
    publications: Publication[];
    projects: Project[];
    timeline: TimelineItem[];
    news: NewsItem[];
    blog?: BlogPost[];
    researchAreas: ResearchArea[];
}

export const loadConfig = async (): Promise<Config> => {
    const response = await fetch(`${import.meta.env.BASE_URL}config.yaml`);
    const text = await response.text();
    return yaml.load(text) as Config;
};
