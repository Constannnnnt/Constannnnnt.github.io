import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag = ({ children, className }: TagProps) => {
  return (
    <Badge variant="outline" className={cn("bg-tag-bg border-tag-border text-tag-text font-normal", className)}>
      {children}
    </Badge>
  );
};
