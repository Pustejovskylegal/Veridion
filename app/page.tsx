import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Trust } from "@/components/Trust";
import { Features } from "@/components/Features";
import { Platform } from "@/components/Platform";
import { Security } from "@/components/Security";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Trust />
      <Features />
      <Platform />
      <Security />
      <FinalCTA />
      <Footer />
    </main>
  );
}
