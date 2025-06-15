"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface bouncingProps {
  children: ReactNode;
  className?: string;
}

const Bouncing = ({ children, className }: bouncingProps) => {
  const bouncingRef = useRef(null);

  useGSAP(
    () => {
      gsap.to(bouncingRef.current, {
        y: -10,
        duration: 0.5,
        ease: "power2.out",
        yoyo: true,
        repeat: -1,
      });
    },
    { dependencies: [] }
  );
  return (
    <div ref={bouncingRef} className={cn("fade-in", className)}>
      {children}
    </div>
  );
};

export default Bouncing;
