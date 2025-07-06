"use client";

import { useRef } from "react";
import Wrapper from "@/components/Wrapper";
import InfiniteHorizontalScroll, {
  InfiniteHorizontalScrollRef,
} from "@/components/InfiniteHorizontalScroll";
import { bricolageGrotesque } from "@/lib/utils";
import BouncingText from "@/components/BouncingText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Lenis from "lenis";
import Header from "./Header";
import AboutSection from "./AboutSection";
import WorkSection from "./WorkSection";
import LogoParticles from "./LogoParticles";

const Home = () => {
  const infiniteScrollRef = useRef<InfiniteHorizontalScrollRef>(null);
  const bouncingTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initialize Lenis
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Reveal animation timeline
      const tl = gsap.timeline();

      // Initial state - hide header, bouncing text, and infinite scroll
      gsap.set([".fade-up", bouncingTextRef.current], {
        opacity: 0,
        y: 30,
      });

      // Fade in the infinite scroll and speed up at the same time
      // @ts-expect-error
      tl.to(infiniteScrollRef.current?.getSliderElement(), {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      })
        .call(
          () => {
            if (infiniteScrollRef.current) {
              infiniteScrollRef.current.animateSpeed(0.8, 1); // Smooth speed up over 1 second
            }
          },
          [],
          0
        ) // Start speeding up at the same time as fade in
        .to({}, { duration: 1 }) // Wait for 2 seconds at high speed
        // Slow down to normal speed smoothly
        .call(() => {
          if (infiniteScrollRef.current) {
            infiniteScrollRef.current.animateSpeed(0.1, 1.5); // Smooth slow down over 1.5 seconds
          }
        })
        .to(
          ".fade-up",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.25,
            ease: "power3.out",
          },
          "-=1" // Start 1 second before the speed change completes
        )
        .from(".fade-in", { opacity: 0, duration: 0.8 }, "-=.75");
    },
    { dependencies: [] }
  );

  return (
    <div
      className={`text-white text-sm font-light pb-32 ${bricolageGrotesque.className}`}
    >
      {/* Hero */}
      <div className="w-full overflow-hidden h-dvh relative pt-8">
        <Wrapper>
          <div>
            <Header />
          </div>
        </Wrapper>

        {/* Logo Particles */}
        <LogoParticles />

        {/* Infinite Horizontal Scroll */}
        <InfiniteHorizontalScroll
          ref={infiniteScrollRef}
          text="onlytheflames."
          className="uppercase text-secondary font-druk-wide-web-bold text-9xl"
          position="absolute top-[calc(100vh-225px)]"
          speed={0.1}
          scrollDistance="-=300px"
        />

        <BouncingText className="absolute font-medium top-[calc(100vh-75px)] left-1/2 -translate-x-1/2">
          Scroll to explore
        </BouncingText>
      </div>

      {/* About */}
      <AboutSection />

      {/* Work */}
      <WorkSection />
    </div>
  );
};

export default Home;
