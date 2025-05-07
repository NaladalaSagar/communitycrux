
import React from "react";
import Layout from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BackButton from "@/components/navigation/BackButton";

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Help" fallbackPath="/help" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              To create an account, click on the "Sign Up" button in the header. You'll need to provide a valid email
              address and create a password. Follow the verification steps sent to your email to complete the registration process.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I start a new discussion thread?</AccordionTrigger>
            <AccordionContent>
              To start a new discussion, navigate to the category where you want to post, then click the "New Thread"
              button. Enter a descriptive title and your message content, then submit. You can also create threads from
              your profile page or the homepage.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I edit or delete my posts?</AccordionTrigger>
            <AccordionContent>
              Yes, you can edit or delete your own posts. Simply navigate to the post and look for the edit or delete options.
              Keep in mind that edit history may be visible to moderators, and some communities have time limits on editing.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>How do upvotes and downvotes work?</AccordionTrigger>
            <AccordionContent>
              Upvotes indicate that users find your content helpful, insightful, or entertaining. Downvotes suggest
              the opposite. Your account accumulates reputation based on votes, which may unlock features or privileges
              in the community.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>What should I do if I see inappropriate content?</AccordionTrigger>
            <AccordionContent>
              If you encounter content that violates our community guidelines, please report it using the "Report"
              option. Our moderation team will review the report and take appropriate action. Please do not engage with
              trolls or respond to inappropriate content.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
};

export default FAQ;
