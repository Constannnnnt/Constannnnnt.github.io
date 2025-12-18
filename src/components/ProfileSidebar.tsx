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
        <div className="relative mb-6 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-50 blur group-hover:opacity-75 transition duration-500 rounded-full"></div>
          <Avatar className="w-40 h-40 relative border-4 border-background shadow-xl">
            <AvatarImage src={resolveUrl(imageUrl)} alt={name} className="object-cover" />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">{name}</h1>
          <Badge variant="secondary" className="px-4 py-1 text-sm font-medium rounded-full">
            {title}
          </Badge>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          <Button variant="ghost" size="icon" className="rounded-none hover:bg-transparent hover:text-primary transition-colors duration-300" asChild>
            <a href={`mailto:${email}`} aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </Button>
          {social.github && (
            <Button variant="ghost" size="icon" className="rounded-none hover:bg-transparent hover:text-primary transition-colors duration-300" asChild>
              <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </Button>
          )}
          {social.twitter && (
            <Button variant="ghost" size="icon" className="rounded-none hover:bg-transparent hover:text-primary transition-colors duration-300" asChild>
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </Button>
          )}
          {social.linkedin && (
            <Button variant="ghost" size="icon" className="rounded-none hover:bg-transparent hover:text-primary transition-colors duration-300" asChild>
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </Button>
          )}
          {social.googleScholar && (
            <Button variant="ghost" size="icon" className="rounded-none hover:bg-transparent hover:text-primary transition-colors duration-300" asChild>
              <a href={social.googleScholar} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">
                <GraduationCap className="w-5 h-5" />
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
