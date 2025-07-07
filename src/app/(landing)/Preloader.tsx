"use client";

import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

interface PreloaderProps {
  children?: React.ReactNode;
}

const Preloader: React.FC<PreloaderProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  //   const splitOverlayRef = useRef<HTMLDivElement>(null);
  const tagsOverlayRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Split text functionality
  const splitText = (
    element: HTMLElement,
    type: "word" | "char" | "both" = "both"
  ) => {
    const text = element.textContent || "";
    const chars: HTMLElement[] = [];
    const words: HTMLElement[] = [];

    if (type === "word" || type === "both") {
      const wordElements = text.split(" ").map((word) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word inline-block";
        wordSpan.textContent = word;
        words.push(wordSpan);
        return wordSpan;
      });

      element.innerHTML = "";
      wordElements.forEach((wordEl, index) => {
        element.appendChild(wordEl);
        if (index < wordElements.length - 1) {
          element.appendChild(document.createTextNode(" "));
        }
      });
    }

    if (type === "char" || type === "both") {
      const charElements = text.split("").map((char) => {
        if (char === " ") return null;
        const charSpan = document.createElement("span");
        charSpan.className = "char inline-block overflow-clip";
        const innerSpan = document.createElement("span");
        innerSpan.className = "inline-block transform -translate-y-full";
        innerSpan.textContent = char;
        charSpan.appendChild(innerSpan);
        chars.push(charSpan);
        return charSpan;
      });

      element.innerHTML = "";
      charElements.forEach((charEl) => {
        if (charEl) {
          element.appendChild(charEl);
        } else {
          element.appendChild(document.createTextNode(" "));
        }
      });
    }

    return { chars, words };
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    if (typeof window === "undefined") return;

    // Register custom ease
    CustomEase.create("hop", ".8, 0, .3, 1");

    // Split text elements
    const splitTextElements = (
      selector: string,
      type: "word" | "char" | "both" = "both",
      addFirstChar = false
    ) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const { chars } = splitText(htmlElement, type);

        if (addFirstChar && chars.length > 0) {
          chars[0].classList.add("first-char");
        }
      });
    };

    // Initialize split text
    splitTextElements(".intro-title h1", "both", true);
    splitTextElements(".outro-title h1", "char");
    splitTextElements(".tag p", "word");
    splitTextElements(".card h1", "both", true);

    // Set initial states
    // Hide the "10" initially
    gsap.set(".preloader .outro-title", { y: "-100%" });
    gsap.set(".split-overlay .outro-title", { y: "-100%" });

    gsap.set(
      [
        ".split-overlay .intro-title .first-char span",
        ".split-overlay .outro-title .char span",
      ],
      { y: "0%" }
    );

    gsap.set(".split-overlay .intro-title .first-char", {
      x: isMobile ? "7.5rem" : "18rem",
      y: isMobile ? "-1rem" : "-2.75rem",
      fontWeight: "900",
      scale: 0.75,
    });

    gsap.set(".split-overlay .outro-title .char", {
      x: isMobile ? "-3rem" : "-8rem",
      fontSize: isMobile ? "6rem" : "14rem",
      fontWeight: 500,
    });

    // Main animation timeline
    const tl = gsap.timeline({
      defaults: { ease: "hop" },
    });

    // Tags animation
    const tags = gsap.utils.toArray(".tag");
    tags.forEach((tag: any, index) => {
      tl.fromTo(
        tag.querySelectorAll("p .word"),
        { y: "-100%" },
        { y: "0", duration: 1 },
        0.5 + index * 0.1
      );
    });

    // Main sequence
    tl.to(
      ".preloader .intro-title .char span",
      {
        y: "0%",
        duration: 0.75,
        stagger: 0.05,
      },
      0.5
    )
      .to(
        ".preloader .intro-title .char:not(.first-char) span",
        {
          y: "100%",
          duration: 0.75,
          stagger: 0.05,
        },
        2
      )
      // Slide down the "10" from top
      .to(
        ".preloader .outro-title",
        {
          y: "0%",
          duration: 0.75,
        },
        2.5
      )
      .to(
        ".preloader .outro-title .char span",
        {
          y: "0%",
          duration: 0.75,
          stagger: 0.075,
        },
        2.5
      )
      .to(
        ".preloader .intro-title .first-char",
        {
          x: isMobile ? "8rem" : "21.25rem",
          duration: 1,
        },
        3.5
      )
      .to(
        ".preloader .outro-title .char",
        {
          x: isMobile ? "-3rem" : "-8rem",
          duration: 1,
        },
        3.5
      )
      .to(
        ".preloader .intro-title .first-char",
        {
          x: isMobile ? "7.5rem" : "18rem",
          y: isMobile ? "-1rem" : "-2.75rem",
          fontWeight: "900",
          scale: 0.75,
          duration: 0.75,
        },
        4.5
      )
      .to(
        ".preloader .outro-title .char",
        {
          x: isMobile ? "-3rem" : "-8rem",
          fontSize: isMobile ? "6rem" : "14rem",
          fontWeight: "500",
          duration: 0.75,
        },
        4.5
      )
      .to(
        ".container",
        {
          clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
          duration: 1,
        },
        5
      );

    // Tags exit animation
    tags.forEach((tag: any, index) => {
      tl.to(
        tag.querySelectorAll("p .word"),
        {
          y: "100%",
          duration: 0.75,
        },
        5.5 + index * 0.1
      );
    });

    // Final reveal - slide containers up and down
    tl.to(
      ".preloader",
      {
        y: "-100%",
        duration: 1,
        ease: "power2.inOut",
      },
      6
    )
      .to(
        ".split-overlay",
        {
          y: "100%",
          duration: 1,
          ease: "power2.inOut",
        },
        6
      )
      .fromTo(
        mainContainerRef,
        {
          clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
          duration: 1,
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
        },
        6
      );

    return () => {
      tl.kill();
    };
  }, [isMobile]);

  return (
    <div ref={containerRef} className="relative w-screen overflow-hidden">
      {/* Preloader */}
      <div
        ref={preloaderRef}
        className="preloader fixed inset-0 w-screen bg-secondary text-primary z-50"
      >
        <div className="intro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <h1 className="uppercase text-6xl md:text-8xl font-bold leading-none">
            ONLYTHEFLAMES//
          </h1>
        </div>
        <div className="outro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-16 md:ml-40">
          <h1 className="uppercase text-6xl md:text-8xl font-bold leading-none">
            TF
          </h1>
        </div>
      </div>

      {/* Split Overlay */}
      {/* <div
        ref={splitOverlayRef}
        className="split-overlay fixed inset-0 w-screen bg-secondary text-primary z-40"
      >
        <div className="intro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <h1 className="uppercase text-6xl md:text-8xl font-bold leading-none">
            ONLYTHEFLAMES//
          </h1>
        </div>
        <div className="outro-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-16 md:ml-40">
          <h1 className="uppercase text-6xl md:text-8xl font-bold leading-none">
            TF
          </h1>
        </div>
      </div> */}

      {/* Tags Overlay */}
      <div
        ref={tagsOverlayRef}
        className="tags-overlay fixed inset-0 z-50 w-screen pointer-events-none text-primary"
      >
        <div className="tag tag-1 absolute top-[15%] left-[15%] w-max overflow-hidden">
          <p className="uppercase text-xs font-medium">Visual Design</p>
        </div>
        <div className="tag tag-2 absolute bottom-[15%] left-[25%] w-max overflow-hidden">
          <p className="uppercase text-xs font-medium">Code Development</p>
        </div>
        <div className="tag tag-3 absolute bottom-[30%] right-[15%] w-max overflow-hidden">
          <p className="uppercase text-xs font-medium">Seamless Launch</p>
        </div>
      </div>

      {/* Main Container ClipPath animation */}
      {/* <div
        ref={mainContainerRef}
        className="container fixed inset-0 w-full flex flex-col justify-between z-20"
        style={{ clipPath: "polygon(0 48%, 0 48%, 0 52%, 0 52%)" }}
      ></div> */}

      {children}
    </div>
  );
};

export default Preloader;
