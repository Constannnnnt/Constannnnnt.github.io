import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "about", label: "About" },
  { id: "projects", label: "Misc" },
  { id: "blogs", label: "Blogs" },
];

export const NavTabs = ({ activeTab, onTabChange }: NavTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="bg-transparent gap-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none",
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
