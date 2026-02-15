import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn, resolveUrl } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  gifUrl?: string;
  link?: string;
  githubUrl?: string;
  videoUrl?: string;
  summary?: string[];
  blogUrl?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const ProjectCard = ({
  title,
  description,
  tags,
  imageUrl,
  gifUrl,
  link,
  githubUrl,
  videoUrl,
  summary,
  blogUrl,
  isOpen: propIsOpen,
  onToggle,
}: ProjectCardProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isTagsOverflowing, setIsTagsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);

  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const toggle = onToggle || (() => setLocalIsOpen(!localIsOpen));

  useEffect(() => {
    const checkOverflow = () => {
      if (tagsRef.current) {
        setIsTagsOverflowing(tagsRef.current.scrollHeight > 32);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tags]);

  return (
    <div
      className="flex flex-col min-h-[500px] bg-card/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 group animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="flex-shrink-0 w-full aspect-[16/9] overflow-hidden bg-muted/10 relative">
          <img
            src={resolveUrl(isHovered && gifUrl ? gifUrl : imageUrl)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <div className="flex-1 p-6 flex flex-col space-y-4">
        <div className="space-y-3">
          <div className="relative flex items-start gap-2 pr-8">
            <div
              ref={tagsRef}
              className={cn(
                "flex flex-wrap gap-1.5 transition-all duration-300 overflow-hidden",
                showAllTags ? "max-h-[500px]" : "max-h-[22px]"
              )}
            >
              {tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase bg-muted/50 text-muted-foreground border border-border/50 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
            {isTagsOverflowing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTags(!showAllTags);
                }}
                className="absolute right-0 top-0 p-0.5 hover:bg-muted rounded transition-colors"
                title={showAllTags ? "Show less" : "Show more tags"}
              >
                <MoreHorizontal className={cn("w-3.5 h-3.5 transition-transform", showAllTags && "rotate-90")} />
              </button>
            )}
          </div>

          <h3 className="text-xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground/90 font-light leading-relaxed flex-1">
          {description}
        </p>

        <div className="pt-4 mt-auto border-t border-border/30">
          <div className="flex items-center gap-4">
            {link && (
              <a href={resolveUrl(link)} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-widest hover:text-primary transition-colors">
                Website
              </a>
            )}
            {githubUrl && (
              <a href={resolveUrl(githubUrl)} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-widest hover:text-primary transition-colors">
                Code
              </a>
            )}
            {videoUrl && (
              <a href={resolveUrl(videoUrl)} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-widest hover:text-primary transition-colors">
                Video
              </a>
            )}
            {blogUrl && (
              <a href={blogUrl} className="text-[10px] font-mono font-bold uppercase tracking-widest hover:text-primary transition-colors">
                Blog
              </a>
            )}

            {summary && summary.length > 0 && (
              <button
                onClick={toggle}
                className="text-[10px] font-mono text-primary/80 hover:text-primary uppercase tracking-widest ml-auto font-bold"
              >
                {isOpen ? "Close" : "Details"}
              </button>
            )}
          </div>

          {isOpen && summary && summary.length > 0 && (
            <div className="mt-4 animate-fade-in border-l border-primary/20 pl-4 py-1">
              <ul className="list-none space-y-1.5">
                {summary.map((point, i) => (
                  <li key={i} className="text-xs font-light text-muted-foreground leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
