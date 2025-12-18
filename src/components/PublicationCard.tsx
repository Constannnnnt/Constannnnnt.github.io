import { Tag } from "./Tag";
import { FileText, Play, ChevronDown, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn, resolveUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PublicationCardProps {
  title: string;
  venue: string;
  tags: string[];
  authors: string;
  highlightAuthor?: string;
  paperUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  gifUrl?: string;
  codeUrl?: string;
  summary?: string[];
  isOpen?: boolean;
  onToggle?: () => void;
}

export const PublicationCard = ({
  title,
  venue,
  tags,
  authors,
  highlightAuthor,
  paperUrl,
  videoUrl,
  imageUrl,
  gifUrl,
  codeUrl,
  summary,
  isOpen: propIsOpen,
  onToggle,
}: PublicationCardProps) => {
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
        // Approximate check: if height > one line (e.g., 32px)
        setIsTagsOverflowing(tagsRef.current.scrollHeight > 32);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tags]);

  return (
    <div 
      className="flex flex-col md:flex-row gap-8 mb-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="flex-shrink-0 w-full md:w-64 h-auto aspect-[4/3] rounded-none overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity bg-muted/20">
          <img 
            src={resolveUrl(isHovered && gifUrl ? gifUrl : imageUrl)} 
            alt={title} 
            className="w-full h-full object-contain transition-all duration-500" 
          />
        </div>
      )}
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
            <div className="w-full border-b border-border pb-1">
                <span className="font-mono text-xs font-bold text-muted-foreground tracking-widest block">
                    {venue}
                </span>
            </div>
            
            <div className="relative flex items-start gap-2 pr-12">
                <div 
                    ref={tagsRef}
                    className={cn(
                        "flex flex-wrap gap-2 transition-all duration-300 overflow-hidden",
                        showAllTags ? "max-h-[500px]" : "max-h-[28px]"
                    )}
                >
                    {tags.map((tag) => (
                        <span key={tag} className="tag-brutal whitespace-nowrap">
                            {tag}
                        </span>
                    ))}
                </div>
                {isTagsOverflowing && (
                    <button 
                        onClick={() => setShowAllTags(!showAllTags)}
                        className="absolute right-0 top-0 p-1 hover:bg-muted rounded transition-colors"
                        title={showAllTags ? "Show less" : "Show more tags"}
                    >
                        <MoreHorizontal className={cn("w-4 h-4 transition-transform", showAllTags && "rotate-90")} />
                    </button>
                )}
            </div>
        </div>

        <h3 className="text-2xl font-serif font-bold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-base text-foreground/80 font-light leading-relaxed">
          {highlightAuthor ? (
            authors.split(', ').map((author, i) => (
              <span key={i} className={author === highlightAuthor ? "font-medium text-foreground border-b border-primary/40" : ""}>
                {author}{i < authors.split(', ').length - 1 ? ', ' : ''}
              </span>
            ))
          ) : (
            authors
          )}
        </p>

        <div className="flex items-center gap-6 pt-3">
          {paperUrl && (
             <a href={resolveUrl(paperUrl)} className="flex items-center text-xs font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors hover:underline">
                PDF
             </a>
          )}
          {videoUrl && (
             <a href={resolveUrl(videoUrl)} className="flex items-center text-xs font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors hover:underline">
                Video
             </a>
          )}
          {codeUrl && (
             <a href={resolveUrl(codeUrl)} className="flex items-center text-xs font-mono font-bold uppercase tracking-wider hover:text-primary transition-colors hover:underline">
                Code
             </a>
          )}
          
          <button 
            onClick={toggle}
            className="flex items-center text-xs font-mono text-muted-foreground hover:text-foreground uppercase tracking-wider ml-auto hover:bg-muted/50 px-2 py-1 transition-colors"
          >
            {isOpen ? "Close Summary" : "Read Summary"}
          </button>
        </div>
        
        {isOpen && (
            <div className="mt-4 p-0 animate-fade-in border-l-2 border-primary/20 pl-6">
                 <ul className="list-none space-y-2">
                    {summary?.map((point, i) => (
                        <li key={i} className="text-base font-light text-foreground/80 leading-relaxed">{point}</li>
                    ))}
                 </ul>
            </div>
        )}
      </div>
    </div>
  );
};
