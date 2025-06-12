import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Bricolage_Grotesque } from "next/font/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage-grotesque",
});
