"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

interface AnimatedLinkProps {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_parent" | "_top";
  className?: string;
  children: ReactNode;
}

const AnimatedLink = ({
  href,
  target,
  className,
  children,
}: AnimatedLinkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (!linkRef.current || !containerRef.current) return;

      // Create two identical text elements - one for original, one for hover state
      const originalText = linkRef.current.textContent || "";

      // Clear the link and create structure
      linkRef.current.innerHTML = `
      <span class="original-text">${originalText}</span>
      <span class="hover-text" aria-hidden="true">${originalText}</span>
    `;

      const originalSpan = linkRef.current.querySelector(
        ".original-text"
      ) as HTMLElement;
      const hoverSpan = linkRef.current.querySelector(
        ".hover-text"
      ) as HTMLElement;

      if (!originalSpan || !hoverSpan) return;

      // Split text into characters
      const originalSplit = new SplitText(originalSpan, { type: "chars" });
      const hoverSplit = new SplitText(hoverSpan, { type: "chars" });

      // Set initial positions
      gsap.set(originalSplit.chars, { y: 0 });
      gsap.set(hoverSplit.chars, { y: "100%" });

      // Position hover text absolutely
      gsap.set(hoverSpan, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
      });

      // Create hover animations
      const hoverIn = () => {
        const tl = gsap.timeline();

        tl.to(originalSplit.chars, {
          y: "-100%",
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.out",
        }).to(
          hoverSplit.chars,
          {
            y: "0%",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
          },
          0
        ); // Start at the same time as the first animation

        return tl;
      };

      const hoverOut = () => {
        const tl = gsap.timeline();

        tl.to(hoverSplit.chars, {
          y: "100%",
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.out",
        }).to(
          originalSplit.chars,
          {
            y: "0%",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.out",
          },
          0
        ); // Start at the same time as the first animation

        return tl;
      };

      // Add event listeners
      linkRef.current.addEventListener("mouseenter", hoverIn);
      linkRef.current.addEventListener("mouseleave", hoverOut);

      // Cleanup function
      return () => {
        if (linkRef.current) {
          linkRef.current.removeEventListener("mouseenter", hoverIn);
          linkRef.current.removeEventListener("mouseleave", hoverOut);
        }
      };
    },
    { dependencies: [], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      <Link
        ref={linkRef}
        href={href}
        target={target}
        className={cn(
          "font-bold text-white overflow-hidden relative inline-block",
          className
        )}
      >
        {children}
      </Link>
    </div>
  );
};

export default AnimatedLink;
