"use client";
import { TransitionRouter } from "next-transition-router";
import { gsap } from "gsap";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TransitionRouter
      auto // Enables auto-detection of internal links , now we dont need to replace all Links with TransitionLink
      leave={(next) => {
        gsap.to("main", {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            next();
          },
        });
      }}
      enter={(next) => {
        gsap.fromTo(
          "main",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            onComplete: () => {
              next();
            },
          }
        );
      }}
    >
      {children}
    </TransitionRouter>
  );
}
