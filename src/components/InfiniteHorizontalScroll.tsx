"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
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

// Define the ref methods that will be exposed to the parent
export interface InfiniteHorizontalScrollRef {
  getSliderElement: () => HTMLDivElement | null;
  setSpeed: (newSpeed: number) => void;
  getCurrentSpeed: () => number;
  animateSpeed: (newSpeed: number, duration?: number) => void;
}

const InfiniteHorizontalScroll = forwardRef<
  InfiniteHorizontalScrollRef,
  InfiniteHorizontalScrollProps
>(
  (
    {
      text,
      className = "",
      containerClassName = "",
      speed = 0.1,
      scrollDistance = "-=300px",
      triggerStart = 0,
      triggerEnd = null,
      scrub = 0.25,
      position = "absolute top-[calc(100vh-225px)]",
    },
    ref
  ) => {
    const firstText = useRef<HTMLParagraphElement>(null);
    const secondText = useRef<HTMLParagraphElement>(null);
    const slider = useRef<HTMLDivElement>(null);
    const animationIdRef = useRef<number>();

    let xPercent = 0;
    let direction = -1;
    let currentSpeed = speed;

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getSliderElement: () => slider.current,
      setSpeed: (newSpeed: number) => {
        currentSpeed = newSpeed;
      },
      getCurrentSpeed: () => currentSpeed,
      animateSpeed: (newSpeed: number, duration: number = 1) => {
        gsap.to(
          { speed: currentSpeed },
          {
            speed: newSpeed,
            duration: duration,
            ease: "power2.inOut",
            onUpdate: function () {
              currentSpeed = this.targets()[0].speed;
            },
          }
        );
      },
    }));

    const infiniteHorizontalScrollAnimation = () => {
      // Add null checks before using refs
      if (!firstText.current || !secondText.current) {
        // If refs are not ready, try again on next frame
        animationIdRef.current = requestAnimationFrame(
          infiniteHorizontalScrollAnimation
        );
        return;
      }

      if (xPercent <= -100) {
        xPercent = 0;
      }
      if (xPercent > 0) {
        xPercent = -100;
      }

      gsap.set(firstText.current, { xPercent: xPercent });
      gsap.set(secondText.current, { xPercent: xPercent });
      xPercent += currentSpeed * direction;

      animationIdRef.current = requestAnimationFrame(
        infiniteHorizontalScrollAnimation
      );
    };

    useGSAP(
      () => {
        gsap.registerPlugin(ScrollTrigger);

        // Start the animation loop
        animationIdRef.current = requestAnimationFrame(
          infiniteHorizontalScrollAnimation
        );

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

        // Cleanup function
        return () => {
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
          }
        };
      },
      { dependencies: [speed, scrollDistance, triggerStart, triggerEnd, scrub] }
    );

    return (
      <div className={cn(position, containerClassName)}>
        <div
          ref={slider}
          className={cn("relative whitespace-nowrap flex opacity-0", className)}
        >
          <p ref={firstText}>{text}</p>
          <p ref={secondText} className="absolute left-[100%]">
            {text}
          </p>
        </div>
      </div>
    );
  }
);

InfiniteHorizontalScroll.displayName = "InfiniteHorizontalScroll";

export default InfiniteHorizontalScroll;
