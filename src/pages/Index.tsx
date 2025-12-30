import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { NavTabs } from "@/components/NavTabs";
import { PublicationCard } from "@/components/PublicationCard";
import { ProjectCard } from "@/components/ProjectCard";
import { VennDiagram } from "@/components/VennDiagram";
import { Menu, ArrowLeft, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useConfig } from "@/hooks/useConfig";
import { BlogPost } from "@/components/BlogPost";
import { Card, CardContent } from "@/components/ui/card";

const RESEARCH_AREA_ANIMATIONS: Record<string, React.ReactNode> = {
  people: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
      <path d="M20 90 Q 50 60 80 90" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  computer: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="20" y="20" width="60" height="45" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M30 75 L70 75 M50 65 L50 75" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="50" y="47" textAnchor="middle" className="text-[10px] animate-pulse font-mono">01</text>
    </svg>
  ),
  environment: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M10 80 L90 80 M30 80 L30 40 M70 80 L70 50" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce" />
    </svg>
  ),
  interact: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M30 50 A 20 20 0 1 1 70 50 A 20 20 0 1 1 30 50" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin-slow origin-center" />
      <rect x="45" y="45" width="10" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  connect: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M20 50 Q 50 15 80 50 Q 50 85 20 50" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="animate-ping" />
    </svg>
  ),
  bridge: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M15 15 L35 15 L35 35 L15 35 Z M65 65 L85 65 L85 85 L65 85 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="35" y1="35" x2="65" y2="65" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="animate-pulse" />
    </svg>
  )
};

const Index = () => {
  const { data: config, isLoading, error } = useConfig();
  const [activeTab, setActiveTab] = useState("about");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openPublicationId, setOpenPublicationId] = useState<number | null>(null);
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

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

  const publications = config.publications || [];
  const projects = config.projects || [];
  const blogs = config.blog || [];
  const researchAreas = config.researchAreas || [];

  const filteredPublications = activeFilter
    ? publications.filter((pub) => pub.categories?.includes(activeFilter))
    : publications;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "blog") {
      setSelectedBlogSlug(null);
    }
  };

  const researchArea = researchAreas.find(area => area.id === activeFilter);
  const currentAreaInfo = researchArea ? {
    sentence: researchArea.sentence,
    animation: RESEARCH_AREA_ANIMATIONS[researchArea.animationType]
  } : null;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <div className="lg:hidden p-4 border-b border-sidebar-border bg-sidebar-background flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <span className="font-serif font-bold text-lg">{config.profile.name}</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-96">
            <ProfileSidebar
              profile={config.profile}
              timeline={config.timeline}
              news={config.news}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block w-96 fixed inset-y-0 z-50">
        <ProfileSidebar
          profile={config.profile}
          timeline={config.timeline}
          news={config.news}
        />
      </div>

      <main className="lg:ml-96 min-h-screen pt-16 lg:pt-0 flex-1">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 lg:pt-6 lg:pb-20">
          <div className="hidden lg:flex justify-end mb-16">
            <NavTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {activeTab === "about" && (
            <div className="animate-fade-in space-y-16">
              <div className="grid lg:grid-cols-12 gap-12 items-start">
                <div className={cn("space-y-6", activeFilter ? "lg:col-span-8" : "lg:col-span-8")}>
                  <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
                    你好.
                  </h1>
                  <div className="text-lg lg:text-xl text-muted-foreground space-y-4 leading-relaxed">
                    {config.profile.bio ? (
                      config.profile.bio.split('\n\n').map((paragraph, i) => (
                        i === 0 ? <div key={i} className="flex items-start gap-3 whitespace-wrap">
                          <BellRing className="w-6 h-6 shrink-0 mt-1" />
                          <div className="inline"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{paragraph}</ReactMarkdown></div>
                        </div> : <ReactMarkdown key={i} rehypePlugins={[rehypeRaw]}>{paragraph}</ReactMarkdown>
                      ))
                    ) : (
                      <p>Null</p>
                    )}
                  </div>
                </div>

                {activeFilter && currentAreaInfo && (
                  <div className="lg:col-span-4 h-full min-h-[200px] flex items-center justify-center p-8 bg-muted/10 border-none relative overflow-hidden group animate-fade-in">
                    <div key={activeFilter} className="space-y-6 text-center">
                      <div className="w-24 h-24 mx-auto text-primary">
                        {currentAreaInfo.animation}
                      </div>
                      <p className="text-sm font-mono text-foreground leading-tight tracking-tight px-4">
                        {currentAreaInfo.sentence}
                      </p>
                    </div>

                  </div>
                )}
              </div>

              {/* Research Section - Dashboard Grid Layout */}
              <section className="space-y-8">
                <div className="flex items-center gap-6">
                  <h2 className="text-2xl font-serif text-foreground shrink-0">Research</h2>
                  <div className="h-[1px] bg-border w-full opacity-60" />
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  {/* Left Sticky Panel: Diagram & Context */}
                  <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 mb-12 lg:mb-0">
                    <div className="bg-card/30 p-4 lg:p-6 backdrop-blur-sm">
                      <VennDiagram
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                      />
                      <p className="text-center text-xs text-muted-foreground mt-4 font-light italic">
                        Interactive: Click to filter projects
                      </p>
                    </div>

                    {/* <div className="text-sm text-muted-foreground space-y-2 font-light pl-2 border-l-2 border-border/50">
                      <p>Published in top-tier HCI venues:</p>
                      <ul className="space-y-1">
                        <li><strong className="font-medium text-foreground">CHI</strong> (human factors)</li>
                        <li><strong className="font-medium text-foreground">UIST</strong> (interfaces)</li>
                        <li><strong className="font-medium text-foreground">IMWUT</strong> (mobile/wearable)</li>
                      </ul>
                    </div> */}
                  </div>

                  {/* Right Panel: Publications List */}
                  <div className="lg:col-span-7 space-y-12">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm tracking-widest uppercase text-muted-foreground">
                        {activeFilter ? `${activeFilter} Projects` : "All Publications"}
                      </span>
                      {activeFilter && (
                        <button onClick={() => setActiveFilter(null)} className="text-xs text-primary hover:underline">
                          Clear Filter
                        </button>
                      )}
                    </div>

                    {filteredPublications.map((pub, index) => (
                      <PublicationCard
                        key={index}
                        {...pub}
                        isOpen={openPublicationId === index}
                        onToggle={() => setOpenPublicationId(openPublicationId === index ? null : index)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}


          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="animate-fade-in space-y-12">
              <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-3xl font-serif font-bold text-foreground">Projects</h2>
                <div className="w-12 h-1 bg-primary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
                {projects.length === 0 ? (
                  <p className="text-muted-foreground italic col-span-full">No projects listed yet.</p>
                ) : (
                  projects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      {...project}
                      isOpen={openProjectId === index}
                      onToggle={() => setOpenProjectId(openProjectId === index ? null : index)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === "blogs" && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                {selectedBlogSlug && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedBlogSlug(null)} className="shrink-0">
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                )}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Blogs</h2>
                  <div className="w-12 h-1 bg-primary" />
                </div>
              </div>

              {!selectedBlogSlug ? (
                <div className="grid gap-6">
                  {blogs.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center py-8">
                          Blog posts coming soon!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    blogs.map((blog) => (
                      <Card
                        key={blog.slug}
                        className="cursor-pointer hover:border-primary transition-colors group"
                        onClick={() => setSelectedBlogSlug(blog.slug)}
                      >
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {blog.title}
                          </h3>
                          <time className="text-sm text-muted-foreground">{blog.date}</time>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                <div>
                  {(() => {
                    const selectedBlog = blogs.find(b => b.slug === selectedBlogSlug);
                    if (!selectedBlog) return <div>Blog not found</div>;
                    return <BlogPost path={selectedBlog.file} />;
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
