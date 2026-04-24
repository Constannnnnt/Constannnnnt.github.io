import { FileText, Play, Code, ChevronDown } from "lucide-react";
import { useState, memo } from "react";
import { cn, resolveUrl } from "@/lib/utils";

interface PublicationCardProps {
  title: string;
  venue: string;
  tags?: string[];
  authors: string;
  highlightAuthor?: string;
  paperUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  gifUrl?: string;
  codeUrl?: string;
  summary?: string[];
  id?: number;
  isOpen?: boolean;
  onToggle?: (id?: number) => void;
}

export const PublicationCard = memo(({
  title,
  venue,
  authors,
  highlightAuthor,
  paperUrl,
  videoUrl,
  imageUrl,
  gifUrl,
  codeUrl,
  summary,
  id,
  isOpen: propIsOpen,
  onToggle,
}: PublicationCardProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
  const toggle = () => onToggle ? onToggle(id) : setLocalIsOpen(!localIsOpen);

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 group py-4 border-b border-border/10 last:border-0 hover:bg-muted/5 transition-all duration-300 px-4 -mx-4 rounded-xl items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LEFT COLUMN: Context (Venue, Thumbnail) */}
      <div className="md:col-span-3 lg:col-span-2 flex flex-col gap-2">
        <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest block">
            {venue}
        </span>
        
        {imageUrl && (
          <div className="w-full aspect-[4/3] rounded overflow-hidden bg-muted/10 border border-border/10 opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
            <img 
              src={resolveUrl(isHovered && gifUrl ? gifUrl : imageUrl)} 
              alt={title} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Typography & Content */}
      <div className="md:col-span-9 lg:col-span-10 flex flex-col gap-1.5">
        <h3 className="text-lg lg:text-xl font-sans font-medium leading-tight text-foreground/90 group-hover:text-primary transition-colors duration-300 pr-8">
          {title}
        </h3>
        
        <p className="text-sm text-foreground/70 font-light leading-relaxed">
          {highlightAuthor ? (
            authors.split(', ').map((author, i) => (
              <span key={i} className={author === highlightAuthor ? "font-medium text-foreground underline decoration-primary/40 underline-offset-4" : ""}>
                {author}{i < authors.split(', ').length - 1 ? ', ' : ''}
              </span>
            ))
          ) : (
            authors
          )}
        </p>

        {/* TL;DR Immediate View */}
        {summary && summary.length > 0 && (
          <p className="text-sm text-muted-foreground italic leading-relaxed mt-1 line-clamp-2">
            "{summary[0]}"
          </p>
        )}

        {/* Links & Actions */}
        <div className="flex flex-wrap items-center gap-6 mt-2 pt-2 border-t border-border/5">
          {paperUrl && (
             <a href={resolveUrl(paperUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                <FileText className="w-3.5 h-3.5" /> PDF
             </a>
          )}
          {videoUrl && (
             <a href={resolveUrl(videoUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                <Play className="w-3.5 h-3.5" /> Video
             </a>
          )}
          {codeUrl && (
             <a href={resolveUrl(codeUrl)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                <Code className="w-3.5 h-3.5" /> Code
             </a>
          )}
          
          {summary && summary.length > 1 && (
            <button 
                onClick={toggle}
                className="flex items-center gap-1 text-xs font-mono font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider ml-auto transition-colors"
            >
                {isOpen ? "Less Context" : "More Context"}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180")} />
            </button>
          )}
        </div>
        
        {/* Expanded Summary */}
        {isOpen && summary && summary.length > 1 && (
            <div className="mt-4 pt-4 border-t border-border/10 animate-fade-in">
                 <ul className="list-disc pl-5 space-y-3">
                    {summary.slice(1).map((point, i) => (
                        <li key={i} className="text-sm font-light text-foreground/80 leading-relaxed marker:text-primary/50">{point}</li>
                    ))}
                 </ul>
            </div>
        )}
      </div>
    </div>
  );
});

PublicationCard.displayName = "PublicationCard";
