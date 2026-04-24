import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn, resolveUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NewsItem {
  date: string;
  text: string;
  link?: string;
}

interface NewsSectionProps {
  items: NewsItem[];
  className?: string;
  initialVisibleCount?: number;
}

export const NewsSection = ({
  items,
  className,
  initialVisibleCount = 3,
}: NewsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = isExpanded ? items : items.slice(0, initialVisibleCount);
  const hasMoreItems = items.length > initialVisibleCount;

  return (
    <div className={cn("w-full pt-8", className)}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-end justify-between mb-6 border-b border-border/40 pb-2">
            <h3 className="text-sm font-sans tracking-widest text-muted-foreground font-medium uppercase">
              News
            </h3>
          {hasMoreItems && (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground font-normal"
              >
                {isExpanded ? "View less" : "View all news"}
              </Button>
            </CollapsibleTrigger>
          )}
        </div>

        <div className="space-y-4">
          {visibleItems.map((item, index) => (
            <div key={index} className="group">
              <div className="flex flex-col sm:flex-row sm:gap-6 items-baseline">
                <span className="text-[11px] tracking-wider font-sans text-muted-foreground/80 w-24 flex-shrink-0">
                  {item.date}
                </span>
                <p className="text-base text-foreground/90 font-light leading-relaxed">
                  {item.link ? (
                    <a
                      href={resolveUrl(item.link)}
                      className="hover:text-primary hover:underline underline-offset-4 decoration-1 transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
};
