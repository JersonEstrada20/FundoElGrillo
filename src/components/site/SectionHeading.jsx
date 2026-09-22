import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ eyebrow, title, children, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="text-xs tracking-architectural uppercase text-accent mb-4 block">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-4xl md:text-5xl leading-[1.1] text-balance">
          {title}
        </h2>
        {children && <p className="mt-5 text-foreground/70 leading-relaxed text-lg">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function CTAButton({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-3 text-sm tracking-architectural uppercase text-accent hover:text-foreground transition-colors"
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}