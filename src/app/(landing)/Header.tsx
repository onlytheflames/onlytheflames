import AnimatedLink from "@/components/AnimatedLink";
import { forwardRef } from "react";

const Header = () => {
  return (
    <header className="flex justify-between">
      <div className="flex flex-col md:flex-row gap-y-3 md:gap-x-8">
        <div className="flex flex-col gap-y-3 xl:flex-row xl:gap-x-8">
          <h2 className="fade-up">Studio of Mario Imanuel Daruranto</h2>
          <div className="fade-up">
            <p>Designer</p>
            <p>Developer</p>
          </div>
        </div>
        <div className="fade-up">
          <p>Jakarta Indonesia</p>
          <AnimatedLink href="/" className="font-bold">
            mariodaruranto68@gmail.com
          </AnimatedLink>
        </div>
      </div>
      <div className="hidden md:block xl:flex xl:gap-x-8">
        <div className="fade-up">
          <div className="flex gap-x-6">
            <span>01</span>
            <AnimatedLink href="/about" className="ml-[3px]">
              about
            </AnimatedLink>
          </div>
          <div className="flex gap-x-6">
            <span>02</span>
            <AnimatedLink href="/journal">journal</AnimatedLink>
          </div>
        </div>
        <div className="fade-up">
          <div className="flex gap-x-6">
            <span>03</span>
            <AnimatedLink
              href="https://www.instagram.com/emdi______/"
              target="_blank"
              className="font-bold"
            >
              instagram
            </AnimatedLink>
          </div>
          <div className="flex gap-x-6">
            <span>04</span>
            <AnimatedLink
              href="https://www.linkedin.com/in/mario-imanuel-daruranto/"
              target="_blank"
              className="font-bold"
            >
              linkedin
            </AnimatedLink>
          </div>
          <div className="flex gap-x-6">
            <span>05</span>
            <AnimatedLink
              href="https://github.com/onlytheflames"
              target="_blank"
              className="font-bold"
            >
              github
            </AnimatedLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
