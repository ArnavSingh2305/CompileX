import type { ReactNode } from "react";

const widths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
} as const;

interface PageProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  width?: keyof typeof widths;
  children: ReactNode;
}

// Notion-style page: optional big icon, large title, muted description, content below.
export const Page = ({ icon, title, description, actions, width = "md", children }: PageProps) => (
  <div className="w-full">
    <div className={`mx-auto px-5 pb-24 pt-10 md:px-12 md:pt-16 ${widths[width]}`}>
      <header className="mb-8 animate-fade-up">
        {icon && <div className="mb-3 text-5xl leading-none">{icon}</div>}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-[40px]">{title}</h1>
          {actions}
        </div>
        {description && <p className="mt-2 text-[15px] text-fg/60">{description}</p>}
      </header>
      {children}
    </div>
  </div>
);
