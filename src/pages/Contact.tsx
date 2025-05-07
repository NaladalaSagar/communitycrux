
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/navigation/BackButton";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thanks for reaching out. We'll get back to you soon!",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Help" fallbackPath="/help" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions, feedback, or need assistance? Fill out the form and our team
              will get back to you as soon as possible.
            </p>
            
            <Card className="p-6 mb-6">
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                For general questions about the forum, user accounts, or community guidelines.
              </p>
              <p className="mt-3">support@community-forum.com</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Technical Support</h3>
              <p className="text-muted-foreground">
                For issues related to site functionality, bugs, or technical problems.
              </p>
              <p className="mt-3">tech-support@community-forum.com</p>
            </Card>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input id="name" placeholder="Your name" required />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email address" required />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input id="subject" placeholder="What is your message about?" required />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea id="message" placeholder="How can we help you?" rows={6} required />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
