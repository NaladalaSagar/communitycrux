
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CtaSection = () => (
  <section className="py-20">
    <div className="container px-4 mx-auto">
      <div className="glass-effect rounded-2xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in">Ready to join the conversation?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Create an account today to start posting, commenting, and connecting with other members of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" size="lg" asChild className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/categories">
                Explore first
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;
