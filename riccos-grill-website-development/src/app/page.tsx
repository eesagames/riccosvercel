import { Shell } from "@/components/Shell";
import { Hero } from "@/components/Hero";
import { Story, StoryTape } from "@/components/Story";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { Offers } from "@/components/Offers";
import { About } from "@/components/About";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <Shell>
      <main id="main">
        <Hero />
        <StoryTape />
        <Story />
        <MenuExplorer />
        <Offers />
        <About />
        <Visit />
      </main>
      <Footer />
    </Shell>
  );
}
