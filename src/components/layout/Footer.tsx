
import { Link } from "react-router-dom";
import { MessageSquare, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-secondary/50 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-6 w-6" />
              <span className="text-xl font-semibold">CommunityHub</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              A modern forum platform designed to foster meaningful discussions and community connections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm hover:text-accent transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/popular" className="text-sm hover:text-accent transition-colors">
                  Popular Discussions
                </Link>
              </li>
              <li>
                <Link to="/recent" className="text-sm hover:text-accent transition-colors">
                  Recent Activity
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Help & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm hover:text-accent transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm hover:text-accent transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CommunityHub. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Crafted with precision and care.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
