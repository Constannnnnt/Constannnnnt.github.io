import { Mail, Github, Twitter, Linkedin, GraduationCap, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/Timeline";
import { NewsSection } from "@/components/NewsSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Profile, TimelineItem, NewsItem } from "@/lib/config";
import { resolveUrl } from "@/lib/utils";

interface ProfileSidebarProps {
  profile: Profile;
  timeline: TimelineItem[];
  news: NewsItem[];
}

export const ProfileSidebar = ({
  profile,
  timeline,
  news,
}: ProfileSidebarProps) => {
  const { name, title, imageUrl, email, social } = profile;

  return (
    <aside className="fixed left-0 top-0 w-96 h-screen bg-sidebar-background border-r border-sidebar-border flex flex-col overflow-y-auto no-scrollbar">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="p-8 flex flex-col items-center">
        <div className="relative mb-8 group">
          <Avatar className="w-40 h-40 relative border border-border/40 shadow-sm transition-transform duration-500 hover:scale-[1.02]">
            <AvatarImage src={resolveUrl(imageUrl)} alt={name} className="object-cover" />
            <AvatarFallback className="bg-muted text-muted-foreground font-sans text-2xl">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-sans font-medium text-foreground tracking-tight">{name}</h1>
          <Badge variant="secondary" className="px-4 py-1 text-xs font-sans tracking-wide rounded-full bg-secondary/50 text-secondary-foreground/80 border border-border/30">
            {title}
          </Badge>
        </div>

        <div className="flex gap-1 justify-center mb-10">
          <Button variant="ghost" size="icon" className="hover:bg-muted/50 hover:text-primary transition-colors duration-300 rounded-full" asChild>
            <a href={`mailto:${email}`} aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
          </Button>
          {social.github && (
            <Button variant="ghost" size="icon" className="hover:bg-muted/50 hover:text-primary transition-colors duration-300 rounded-full" asChild>
              <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          )}
          {social.twitter && (
            <Button variant="ghost" size="icon" className="hover:bg-muted/50 hover:text-primary transition-colors duration-300 rounded-full" asChild>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </Button>
          )}
          {social.linkedin && (
            <Button variant="ghost" size="icon" className="hover:bg-muted/50 hover:text-primary transition-colors duration-300 rounded-full" asChild>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
          {social.googleScholar && (
            <Button variant="ghost" size="icon" className="hover:bg-muted/50 hover:text-primary transition-colors duration-300 rounded-full" asChild>
              <a href={social.googleScholar} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
                <GraduationCap className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>

        <div className="space-y-8 w-full">
          <div className="w-full">
            <Timeline items={timeline} />
          </div>
          <div className="w-full">
            <NewsSection items={news} />
          </div>
        </div>
      </div>
    </aside>
  );
};
