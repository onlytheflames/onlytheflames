"use client";

import { useEffect, useRef, useState } from "react";
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
import Preloader from "./Preloader";

const Home = () => {
  const infiniteScrollRef = useRef<InfiniteHorizontalScrollRef>(null);
  // const bouncingTextRef = useRef<HTMLDivElement>(null);

  // Disable webgl for safari & mobile
  const [isSafari, setIsSafari] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isSafariCheck = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    setIsSafari(isSafariCheck);
    setIsMobile(window.innerWidth <= 1000);
  }, []);

  useGSAP(
    () => {
      // Initialize Lenis
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Different animations for Safari/mobile vs desktop
      if (isSafari || isMobile) {
        // @ts-expect-error type error
        gsap.set(infiniteScrollRef.current?.getSliderElement(), { opacity: 1 });

        // Set slower speed for Safari/mobile to match desktop
        if (infiniteScrollRef.current) {
          infiniteScrollRef.current.animateSpeed(0.1, 1.5); // Slower speed for Safari/mobile
        }
      } else {
        // Simplified timeline for desktop - just infinite scroll animation
        const tl = gsap.timeline();

        // @ts-expect-error TweenTarget type error
        tl.to(infiniteScrollRef.current?.getSliderElement(), {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        }).call(() => {
          if (infiniteScrollRef.current) {
            infiniteScrollRef.current.animateSpeed(0.1, 1.5); // Normal speed for desktop
          }
        });
      }
    },
    { dependencies: [isSafari, isMobile] }
  );
  return (
    <div
      className={`text-white text-sm font-light pb-32 ${bricolageGrotesque.className}`}
    >
      {!isSafari && !isMobile ? (
        <Preloader>
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
        </Preloader>
      ) : (
        <Preloader>
          {/* Hero */}
          <div className="w-full overflow-hidden h-dvh relative pt-8">
            <Wrapper>
              <div>
                <Header />
              </div>
            </Wrapper>

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
        </Preloader>
      )}
    </div>
  );
};

export default Home;
