type FlowDividerProps = {
  variant: "sky" | "olive" | "terracotta" | "paper";
};

export function FlowDivider({ variant }: FlowDividerProps) {
  return (
    <div className={`flow-divider flow-divider--${variant}`} aria-hidden="true">
      <span className="flow-divider__wash" />
      <span className="flow-divider__thread" />
      <span className="flow-divider__petal flow-divider__petal--one" />
      <span className="flow-divider__petal flow-divider__petal--two" />
      <span className="flow-divider__petal flow-divider__petal--three" />
      <span className="flow-divider__leaf flow-divider__leaf--one" />
      <span className="flow-divider__leaf flow-divider__leaf--two" />
    </div>
  );
}
