import { Hero } from "@/components/hero";
import { ToolGrid } from "@/components/tool-grid";

export default function Home() {
  return (
    <div className='space-y-12'>
      <Hero />
      <ToolGrid />
    </div>
  );
}
