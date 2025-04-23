
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section className="relative py-20 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent -z-10"></div>
    <div className="container px-4 mx-auto text-center relative">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
          Welcome to <span className="text-accent">CommunityHub</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Join our thriving community to share knowledge, ask questions, and connect with like-minded individuals.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button size="lg" className="bg-accent hover:bg-accent/90 flex animate-scale-in" asChild>
            <Link to="/create-thread">Create Thread</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <Link to="/categories">Browse topics</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
