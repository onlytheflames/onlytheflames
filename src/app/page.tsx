"use client";

import Wrapper from "@/components/Wrapper";
import InfiniteHorizontalScroll from "@/components/InfiniteHorizontalScroll";
import { bricolageGrotesque } from "@/lib/utils";
import Bouncing from "@/components/Bouncing";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

const Home = () => {
  return (
    <div
      className={`text-white text-sm font-light ${bricolageGrotesque.className}`}
    >
      {/* Preloader */}

      {/* Hero */}
      <div className="w-full overflow-hidden h-dvh relative pt-8">
        <Wrapper>
          <header className="flex justify-between">
            <div className="flex flex-col md:flex-row gap-y-3 md:gap-x-8">
              <div className="flex flex-col gap-y-3 xl:flex-row xl:gap-x-8">
                <h2>Studio of Mario Imanuel Daruranto</h2>
                <div>
                  <p>Designer</p>
                  <p>Developer</p>
                </div>
              </div>
              <div>
                <p>Jakarta Indonesia</p>
                <p className="font-bold">mariodaruranto68@gmail.com</p>
              </div>
            </div>
            <div className="hidden md:block xl:flex xl:gap-x-8">
              <div>
                <div className="flex gap-x-6">
                  <span>01</span>
                  <Link href="/journal" className="font-bold">
                    journal
                  </Link>
                </div>
                <div className="flex gap-x-6">
                  <span>02</span>
                  <Link href="/journal" className="font-bold">
                    journal
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex gap-x-6">
                  <span>03</span>
                  <Link
                    href="https://www.instagram.com/emdi______/"
                    target="_blank"
                    className="font-bold"
                  >
                    instagram
                  </Link>
                </div>
                <div className="flex gap-x-6">
                  <span>04</span>
                  <Link
                    href="https://www.linkedin.com/in/mario-imanuel-daruranto/"
                    target="_blank"
                    className="font-bold"
                  >
                    linkedin
                  </Link>
                </div>
                <div className="flex gap-x-6">
                  <span>05</span>
                  <Link
                    href="https://github.com/onlytheflames"
                    target="_blank"
                    className="font-bold"
                  >
                    github
                  </Link>
                </div>
              </div>
            </div>
          </header>
        </Wrapper>

        {/* Infinite Horizontal Scroll */}
        <InfiniteHorizontalScroll
          text="onlytheflames."
          className="uppercase text-secondary font-druk-wide-web-bold text-9xl"
          position="absolute top-[calc(100vh-225px)]"
          speed={0.1}
          scrollDistance="-=300px"
        />

        <Bouncing className="absolute font-medium top-[calc(100vh-75px)] left-1/2 -translate-x-1/2">
          Scroll to explore
        </Bouncing>
      </div>

      {/* About */}
      <Wrapper className="w-full h-screen flex flex-col items-center justify-center font-medium text-2xl">
        <p className="leading-10 text-2xl text-center font-medium">
          Web development that's more than just functional <br />
          --it's transformational.
        </p>
        <Link
          href="/about"
          className="px-4 py-2 rounded-full mt-8 font-druk-wide-web-bold text-secondary border border-secondary text-xs"
        >
          find out more
        </Link>
      </Wrapper>
    </div>
  );
};

export default Home;
