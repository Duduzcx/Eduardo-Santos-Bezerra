import React from "react";

export function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.62-.4 7.5-1.81 7.5-8.18a5.4 5.4 0 0 0-1.54-4 5.4 5.4 0 0 0-.15-3.93s-1.25-.4-4 1.44a12.9 12.9 0 0 0-7 0C6.25 1.5 5 1.9 5 1.9a5.4 5.4 0 0 0-.15 3.93 5.4 5.4 0 0 0-1.54 4c0 6.36 3.87 7.78 7.5 8.18a4.8 4.8 0 0 0-1 3.02v4" />
      <path d="M9 20a5.5 5.5 0 0 1-5-3" />
    </svg>
  );
}

export function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
