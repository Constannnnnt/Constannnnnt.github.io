import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format, parse, differenceInMonths, differenceInYears } from "date-fns";

interface TimelineItem {
  date: string;
  startDate?: string;
  endDate?: string;
  title: string;
  subtitle: string;
  type: "education" | "work";
  description?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline = ({ items, className }: TimelineProps) => {
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Default to showing only the first item (latest)
  const visibleItems = showFullHistory ? items : [items[0]];

  const formatPeriod = (start?: string, end?: string) => {
    if (!start) return null;
    try {
      const startDate = parse(start, "yyyy-MM", new Date());
      const endDate = end ? parse(end, "yyyy-MM", new Date()) : new Date();
      
      let years = differenceInYears(endDate, startDate);
      let months = differenceInMonths(endDate, startDate) % 12 + 1;
      if (months === 12) {
        years += 1;
        months = 0;
      }
      
      let duration = "";
      if (years > 0) duration += `${years} yr${years > 1 ? "s" : ""} `;
      if (months > 0) duration += `${months} mo${months > 1 ? "s" : ""}`;
      
      const startFormatted = format(startDate, "MMM yyyy");
      const endFormatted = end ? format(endDate, "MMM yyyy") : "Present";
      
      return {
          range: `${startFormatted} — ${endFormatted}`,
          duration: duration.trim()
      };
    } catch (e) {
      return null;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-serif tracking-widest text-foreground font-bold uppercase">
          Experience
        </h3>
        
        {items.length > 1 && (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullHistory(!showFullHistory)}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground font-normal whitespace-nowrap"
            >
                {showFullHistory ? "Show Latest" : "View Full History"}
            </Button>
        )}
      </div>

      <div className="relative border-l border-border ml-2 space-y-8 pl-8 py-2">
        {visibleItems.map((item, index) => {
          const globalIndex = items.indexOf(item);
          const isExpanded = expandedIndex === globalIndex;
          const period = formatPeriod(item.startDate, item.endDate);
          
          return (
            <div key={index} className="relative group">
              <div className="absolute -left-[38px] top-[9px] w-[9px] h-[9px] bg-border group-hover:bg-primary transition-colors duration-200" />

              <Collapsible
                open={isExpanded}
                onOpenChange={() => setExpandedIndex(isExpanded ? null : globalIndex)}
              >
                <CollapsibleTrigger asChild>
                  <button className="text-left w-full group-hover:translate-x-1 transition-transform duration-200 ease-out outline-none space-y-1">
                    <h4 className="font-serif text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono">
                      <span className="text-muted-foreground font-medium">{item.subtitle}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-muted-foreground/70">{period ? period.range : item.date}</span>
                      {period && period.duration && (
                        <span className="text-muted-foreground/50 italic">({period.duration})</span>
                      )}
                    </div>
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <div className="pt-4">
                    {item.description && (
                        <div className="text-sm font-light text-foreground/90 leading-relaxed border-l border-border pl-4 py-1 italic">
                        {item.description}
                        </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
};
