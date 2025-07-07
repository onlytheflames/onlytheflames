import Link from "next/link";
import Wrapper from "@/components/Wrapper";

const AboutSection = () => {
  return (
    <Wrapper className="w-full h-screen flex flex-col items-center justify-center">
      <p className="leading-10 md:leading-20 max-w-md md:max-w-4xl text-2xl md:text-6xl text-center font-medium">
        Creating websites that&apos;s more than just functional --it&apos;s
        transformational.
      </p>
      <Link
        href="/about"
        className="px-4 py-2 rounded-full mt-8 font-druk-wide-web-bold text-secondary border border-secondary text-xs"
      >
        find out more
      </Link>
    </Wrapper>
  );
};

export default AboutSection;
