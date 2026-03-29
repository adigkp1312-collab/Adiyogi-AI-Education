"use client";

import dynamic from "next/dynamic";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

// Dynamic imports for GSAP-heavy components (avoid SSR issues)
const HomeHero = dynamic(() => import("@/components/home/HomeHero"), { ssr: false });
const HomeProduct = dynamic(() => import("@/components/home/HomeProduct"), { ssr: false });
const HomeEnterprise = dynamic(() => import("@/components/home/HomeEnterprise"), { ssr: false });
const HomeNews = dynamic(() => import("@/components/home/HomeNews"), { ssr: false });
const HomeCTA = dynamic(() => import("@/components/home/HomeCTA"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeHero />
        <div id="product">
          <HomeProduct />
        </div>
        <div id="languages">
          <HomeEnterprise />
        </div>
        <div id="features">
          <HomeNews />
        </div>
        <HomeCTA />
      </main>
      <Footer />
    </>
  );
}
