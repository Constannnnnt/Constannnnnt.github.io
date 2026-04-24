import { cn } from "@/lib/utils";

interface VennDiagramProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  className?: string;
}

export const VennDiagram = ({
  activeFilter,
  onFilterChange,
  className,
}: VennDiagramProps) => {
  const handleClick = (area: string) => {
    onFilterChange(activeFilter === area ? null : area);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full max-w-md lg:max-w-xl mx-auto aspect-square">
        <svg viewBox="0 0 600 600" className="w-full h-full lg:-translate-x-12 overflow-visible">
          <circle
            cx="300"
            cy="200"
            r="150"
            fill="currentColor"
            className={cn("transition-all duration-500 cursor-pointer stroke-muted-foreground/40", 
              activeFilter === "people" || !activeFilter ? "text-foreground/5" : "text-transparent hover:text-foreground/5"
            )}
            strokeWidth="1"
            onClick={() => handleClick("people")}
          />
          <text
            x="300"
            y="170"
            textAnchor="middle"
            className="fill-foreground/80 text-xl font-medium tracking-wide pointer-events-none"
            style={{ fontFamily: "inherit" }}
          >
            People
          </text>

          <circle
            cx="210"
            cy="360"
            r="150"
            fill="currentColor"
            className={cn("transition-all duration-500 cursor-pointer stroke-muted-foreground/40", 
              activeFilter === "computer" || !activeFilter ? "text-foreground/5" : "text-transparent hover:text-foreground/5"
            )}
            strokeWidth="1"
            onClick={() => handleClick("computer")}
          />
          <text
            x="160"
            y="420"
            textAnchor="middle"
            className="fill-foreground/80 text-xl font-medium tracking-wide pointer-events-none"
            style={{ fontFamily: "inherit" }}
          >
            Virtual Space
          </text>

          <circle
            cx="390"
            cy="360"
            r="150"
            fill="currentColor"
            className={cn("transition-all duration-500 cursor-pointer stroke-muted-foreground/40", 
              activeFilter === "environment" || !activeFilter ? "text-foreground/5" : "text-transparent hover:text-foreground/5"
            )}
            strokeWidth="1"
            onClick={() => handleClick("environment")}
          />
          <text
            x="440"
            y="420"
            textAnchor="middle"
            className="fill-foreground/80 text-xl font-medium tracking-wide pointer-events-none"
            style={{ fontFamily: "inherit" }}
          >
            Physical Space
          </text>

          <defs>
            <marker id="arrowInteractEnd" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground/60" />
            </marker>
            <marker id="arrowConnectEnd" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground/60" />
            </marker>
            <marker id="arrowBridgeEnd" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground/60" />
            </marker>

            <marker id="arrowInteractStart" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
              <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground/60" />
            </marker>
            <marker id="arrowConnectStart" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
              <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground/60" />
            </marker>
            <marker id="arrowBridgeStart" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto-start-reverse">
              <path d="M0,0 L0,6 L9,3 z" className="fill-muted-foreground/60" />
            </marker>

            <path id="pathInteract" d="M 194 94 C 60 60 10 310 60 360" />
            <path id="pathConnect" d="M 406 94 C 530 70 580 300 540 360" />
            <path id="pathBridge" d="M 135 490 C 135 600 465 600 465 490" />
          </defs>

          <g className={cn(
            "cursor-pointer transition-opacity duration-500",
            activeFilter === "interact" ? "opacity-100" : activeFilter ? "opacity-30" : "opacity-100"
          )}
            onClick={() => handleClick("interact")}
          >
            <path
              d="M 194 94 C 60 60 10 310 60 360"
              fill="none"
              className="stroke-muted-foreground/60"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              markerStart="url(#arrowInteractStart)"
              markerEnd="url(#arrowInteractEnd)"
            />
            <text className="fill-muted-foreground/80 text-[11px] font-sans font-medium uppercase tracking-widest" dy="15">
              <textPath href="#pathInteract" startOffset="50%" textAnchor="middle">
                Interaction
              </textPath>
            </text>
          </g>

          <g className={cn(
            "cursor-pointer transition-opacity duration-500",
            activeFilter === "connect" ? "opacity-100" : activeFilter ? "opacity-30" : "opacity-100"
          )}
            onClick={() => handleClick("connect")}
          >
            <path
              d="M 406 94 C 530 70 580 300 540 360"
              fill="none"
              className="stroke-muted-foreground/60"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              markerStart="url(#arrowConnectStart)"
              markerEnd="url(#arrowConnectEnd)"
            />
            <text className="fill-muted-foreground/80 text-[11px] font-sans font-medium uppercase tracking-widest" dy="-12">
              <textPath href="#pathConnect" startOffset="50%" textAnchor="middle">
                Connect
              </textPath>
            </text>
          </g>

          <g className={cn(
            "cursor-pointer transition-opacity duration-500",
            activeFilter === "bridge" ? "opacity-100" : activeFilter ? "opacity-30" : "opacity-100"
          )}
            onClick={() => handleClick("bridge")}
          >
            <path
              d="M 135 490 C 135 600 465 600 465 490"
              fill="none"
              className="stroke-muted-foreground/60"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              markerStart="url(#arrowBridgeStart)"
              markerEnd="url(#arrowBridgeEnd)"
            />
            <text className="fill-muted-foreground/80 text-[11px] font-sans font-medium uppercase tracking-widest" dy="15">
              <textPath href="#pathBridge" startOffset="50%" textAnchor="middle">
                Bridge
              </textPath>
            </text>
          </g>
        </svg>
      </div>

      {activeFilter && (
        <div className="text-center mt-4">
          <button
            onClick={() => onFilterChange(null)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Filtering by: <span className="text-primary font-medium capitalize">{activeFilter}</span> — click to clear
          </button>
        </div>
      )}
    </div>
  );
};
