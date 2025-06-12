"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { text } from "stream/consumers";
import { cn } from "@/lib/utils";

interface InfiniteHorizontalScrollProps {
  text: string;
  className?: string;
  containerClassName?: string;
  speed?: number;
  scrollDistance?: string;
  triggerStart?: number;
  triggerEnd?: number | null;
  scrub?: number;
  position?: string;
}

const InfiniteHorizontalScroll = ({
  text,
  className = "",
  containerClassName = "",
  speed = 0.1,
  scrollDistance = "-=300px",
  triggerStart = 0,
  triggerEnd = null, // Will default to window.innerHeight
  scrub = 0.25,
  position = "absolute top-[calc(100vh-225px)]",
}: InfiniteHorizontalScrollProps) => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);

  let xPercent = 0;
  let direction = -1;

  const infiniteHorizontalScrollAnimation = () => {
    if (xPercent <= -100) {
      xPercent = 0;
    }
    if (xPercent > 0) {
      xPercent = -100;
    }
    gsap.set(firstText.current, { xPercent: xPercent });
    gsap.set(secondText.current, { xPercent: xPercent });
    xPercent += speed * direction;
    requestAnimationFrame(infiniteHorizontalScrollAnimation);
  };

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      requestAnimationFrame(infiniteHorizontalScrollAnimation);

      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          start: triggerStart,
          end: triggerEnd || window.innerHeight,
          scrub: scrub,
          onUpdate: (e) => (direction = e.direction * -1),
        },
        x: scrollDistance,
      });
    },
    { dependencies: [speed, scrollDistance, triggerStart, triggerEnd, scrub] }
  );

  return (
    <div className={cn(position, containerClassName)}>
      <div
        ref={slider}
        className={cn("relative whitespace-nowrap flex", className)}
      >
        <p ref={firstText}>{text}</p>
        <p ref={secondText} className="absolute left-[100%]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default InfiniteHorizontalScroll;
