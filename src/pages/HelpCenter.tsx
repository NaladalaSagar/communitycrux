
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BackButton from "@/components/navigation/BackButton";

const HelpCenter = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              New to our community? Learn the basics of navigating and participating in discussions.
            </p>
            <Button asChild variant="outline">
              <Link to="/guidelines">View Guidelines</Link>
            </Button>
          </Card>
          
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">FAQ</h2>
            <p className="text-muted-foreground mb-4">
              Find answers to frequently asked questions about account management, posting, and more.
            </p>
            <Button asChild variant="outline">
              <Link to="/faq">Browse FAQs</Link>
            </Button>
          </Card>
          
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">Contact Support</h2>
            <p className="text-muted-foreground mb-4">
              Need personalized assistance? Our support team is ready to help with any issues.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </Card>
          
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-3">Community Guidelines</h2>
            <p className="text-muted-foreground mb-4">
              Learn about our community standards and how to contribute positively to discussions.
            </p>
            <Button asChild variant="outline">
              <Link to="/guidelines">Read Guidelines</Link>
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
