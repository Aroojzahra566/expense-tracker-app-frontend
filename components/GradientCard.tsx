import { type ReactNode } from "react";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GradientCard({
  children,
  className = "",
  delay = 0,
}: GradientCardProps) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="gradient-card">
        <div className={`gradient-card-inner ${className}`}>{children}</div>
      </div>
    </div>
  );
}
