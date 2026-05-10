import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { NavTabs } from "@/components/NavTabs";
import { PublicationCard } from "@/components/PublicationCard";
import { ProjectCard } from "@/components/ProjectCard";
import { ArrowLeft, BellRing, Mail, Github, Twitter, Linkedin, GraduationCap, Menu } from "lucide-react";
import { cn, resolveUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useConfig } from "@/hooks/useConfig";
import { BlogPost } from "@/components/BlogPost";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const { data: config, isLoading, error } = useConfig();
  const [activeTab, setActiveTab] = useState("about");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openPublicationId, setOpenPublicationId] = useState<number | null>(null);
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const slug = params.get('slug');

    if (tab) {
      setActiveTab(tab);
    }
    if (slug) {
      setSelectedBlogSlug(slug);
    }
  }, []);

  const publications = config?.publications || [];
  const projects = config?.projects || [];
  const blogs = config?.blog || [];

  const filteredPublications = useMemo(() => {
    return activeFilter
      ? publications.filter((pub: any) => pub.categories?.includes(activeFilter))
      : publications;
  }, [publications, activeFilter]);

  const handleTogglePublication = useCallback((id?: number) => {
    if (id !== undefined) setOpenPublicationId(prev => prev === id ? null : id);
  }, []);

  const handleToggleProject = useCallback((id?: number) => {
    if (id !== undefined) setOpenProjectId(prev => prev === id ? null : id);
  }, []);

  const renderedBio = useMemo(() => {
    if (!config?.profile?.bio) return <p>Null</p>;
    return config.profile.bio.split('\n\n').map((paragraph: string, i: number) => {
      const bioTooltip = config.profile.bioTooltip;
      const hasTooltip = bioTooltip && bioTooltip.paragraphIndex === i;

      if (hasTooltip && bioTooltip.highlightLabel) {
        const label = bioTooltip.highlightLabel;
        const labelIndex = paragraph.toLowerCase().indexOf(label.toLowerCase());

        if (labelIndex !== -1) {
          const before = paragraph.slice(0, labelIndex);
          const match = paragraph.slice(labelIndex, labelIndex + label.length);
          const after = paragraph.slice(labelIndex + label.length);

          return (
            <div key={i}>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={{ p: ({ children }) => <>{children}</> }}>{before}</ReactMarkdown>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer underline decoration-dotted decoration-primary/50 underline-offset-4 text-foreground hover:text-primary transition-colors font-normal">
                    {match}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-md px-4 py-3">
                  <p className="text-sm font-light">
                    {bioTooltip.text}{" "}
                    {bioTooltip.supervisors && bioTooltip.supervisors.length > 0 ? (
                      bioTooltip.supervisors.map((supervisor: any, idx: number) => (
                        <React.Fragment key={idx}>
                          <a href={supervisor.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
                            {supervisor.name}
                          </a>
                          {idx < bioTooltip.supervisors.length - 1 ? ", " : ""}
                        </React.Fragment>
                      ))
                    ) : (
                      ""
                    )}
                    {" at the University of Waterloo and Université de Lille."}
                  </p>
                </TooltipContent>
              </Tooltip>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={{ p: ({ children }) => <>{children}</> }}>{after}</ReactMarkdown>
            </div>
          );
        }
      }

      return i === 0 ? (
        // <div key={i} className="flex items-start gap-4">
        //   <BellRing className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground/60" />
        //   <div className="inline"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{paragraph}</ReactMarkdown></div>
        // </div>
        <></>
      ) : (
        <ReactMarkdown key={i} rehypePlugins={[rehypeRaw]}>{paragraph}</ReactMarkdown>
      );
    });
  }, [config?.profile?.bio, config?.profile?.bioTooltip]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "blog") {
      setSelectedBlogSlug(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-destructive">
        Error loading configuration. Please check public/config.yaml.
      </div>
    );
  }

  const { name, title, imageUrl, email, social } = config.profile;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

      {/* GLOBAL TOP NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/20 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="font-sans font-medium tracking-tight text-lg">{name}</div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />
          <div className="w-[1px] h-4 bg-border/40 mx-2" />
          <ThemeToggle />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-6">
              <div className="flex flex-col gap-6 mt-8">
                <NavTabs activeTab={activeTab} onTabChange={(tab) => {
                  handleTabChange(tab);
                  // Close sheet logic typically goes here if controlled
                }} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-12 pt-28 pb-32 animate-fade-in">

        {/* ABOUT & RESEARCH TAB */}
        {activeTab === "about" && (
          <div className="animate-fade-in space-y-20">

            {/* HERO: Avatar + Bio */}
            <section className="flex flex-col gap-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 relative shadow-sm border border-border/20 shrink-0">
                  <AvatarImage src={resolveUrl(imageUrl)} alt={name} className="object-cover" />
                  <AvatarFallback className="bg-muted text-muted-foreground font-sans text-3xl">{name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center space-y-3 pt-2">
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                    {name}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
                    {title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <a href={`mailto:${email}`} aria-label="Email" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all text-muted-foreground hover:text-foreground">
                      <Mail className="w-3.5 h-3.5" /> <span>Email</span>
                    </a>
                    {social.github && (
                      <a href={social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all text-muted-foreground hover:text-foreground">
                        <Github className="w-3.5 h-3.5" /> <span>GitHub</span>
                      </a>
                    )}
                    {social.twitter && (
                      <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all text-muted-foreground hover:text-foreground">
                        <Twitter className="w-3.5 h-3.5" /> <span>Twitter</span>
                      </a>
                    )}
                    {social.linkedin && (
                      <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all text-muted-foreground hover:text-foreground">
                        <Linkedin className="w-3.5 h-3.5" /> <span>LinkedIn</span>
                      </a>
                    )}
                    {social.googleScholar && (
                      <a href={social.googleScholar} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-medium transition-all text-muted-foreground hover:text-foreground">
                        <GraduationCap className="w-3.5 h-3.5" /> <span>Scholar</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-base text-foreground/80 space-y-4 leading-relaxed font-light">
                {/* <h2 className="text-2xl font-light text-foreground mb-6">你好.</h2> */}
                {renderedBio}
              </div>
            </section>

            {/* PUBLICATIONS GRID */}
            <section className="space-y-8 border-t border-border/20 pt-4">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-medium tracking-tight text-foreground">
                  Publications
                </h2>
              </div>

              {/* High density single column for publications */}
              <div className="flex flex-col space-y-8">
                {filteredPublications.map((pub, index) => (
                  <PublicationCard
                    key={index}
                    {...pub}
                    id={index}
                    isOpen={openPublicationId === index}
                    onToggle={handleTogglePublication}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="animate-fade-in space-y-8">
            <h2 className="text-xl font-medium tracking-tight text-foreground border-b border-border/20 pb-4">
              Projects
            </h2>

            {/* 3 columns for high density, making use of max-w-7xl */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {projects.length === 0 ? (
                <p className="text-muted-foreground italic col-span-full">No projects listed yet.</p>
              ) : (
                projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    {...project}
                    id={index}
                    isOpen={openProjectId === index}
                    onToggle={handleToggleProject}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === "blogs" && (
          <div className="animate-fade-in space-y-8">
            <div className="flex items-center gap-4 border-b border-border/20 pb-4">
              {selectedBlogSlug && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedBlogSlug(null)} className="shrink-0 rounded-full hover:bg-muted/50 -ml-2 h-8 w-8">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                {selectedBlogSlug ? "Reading" : "Writing"}
              </h2>
            </div>

            {!selectedBlogSlug ? (
              <div className="grid gap-4 max-w-4xl">
                {blogs.length === 0 ? (
                  <p className="text-muted-foreground text-sm font-light">
                    Writing coming soon.
                  </p>
                ) : (
                  blogs.map((blog) => (
                    <div
                      key={blog.slug}
                      className="cursor-pointer group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 border border-border/10 bg-muted/5 rounded-lg p-5 hover:border-primary/30 transition-all duration-300"
                      onClick={() => setSelectedBlogSlug(blog.slug)}
                    >
                      <time className="text-[10px] tracking-widest uppercase text-muted-foreground/60 w-24 shrink-0">{blog.date}</time>
                      <h3 className="text-lg font-medium text-foreground/90 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                {(() => {
                  const selectedBlog = blogs.find(b => b.slug === selectedBlogSlug);
                  if (!selectedBlog) return <div>Writing not found</div>;
                  return <BlogPost path={selectedBlog.file} />;
                })()}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Index;
