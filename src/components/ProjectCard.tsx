import { MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";
import { cn, resolveUrl } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  tags?: string[];
  imageUrl?: string;
  gifUrl?: string;
  link?: string;
  githubUrl?: string;
  videoUrl?: string;
  summary?: string[];
  blogUrl?: string;
  id?: number;
  isOpen?: boolean;
  onToggle?: (id?: number) => void;
}

export const ProjectCard = memo(({
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
  id,
  isOpen: propIsOpen,
  onToggle,
}: ProjectCardProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const toggle = () => onToggle ? onToggle(id) : setLocalIsOpen(!localIsOpen);

  return (
    <div
      className="flex flex-col min-h-[500px] bg-transparent border border-border/20 rounded-xl hover:border-border/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5 group animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="flex-shrink-0 w-full aspect-[16/9] overflow-hidden bg-muted/5 relative border-b border-border/10 rounded-t-xl">
          <img
            src={resolveUrl(isHovered && gifUrl ? gifUrl : imageUrl)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <div className="flex-1 p-6 flex flex-col space-y-4">
        <h3 className="text-xl font-sans font-medium leading-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

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
            <div className="mt-4 animate-fade-in border-l border-border/40 pl-4 py-1">
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
});

ProjectCard.displayName = "ProjectCard";
