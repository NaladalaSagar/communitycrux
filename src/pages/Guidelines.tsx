
import React from "react";
import Layout from "@/components/layout/Layout";
import BackButton from "@/components/navigation/BackButton";

const Guidelines = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Help" fallbackPath="/help" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Community Guidelines</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Our community thrives when everyone participates respectfully. Please follow these guidelines
            to ensure a positive experience for all members.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Be Respectful</h2>
          <p>
            Treat others with respect. Disagreements are natural, but always focus on the ideas rather than attacking
            the person expressing them. Avoid offensive language, personal attacks, and discriminatory comments.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Stay On Topic</h2>
          <p>
            Post in the appropriate categories and keep discussions relevant to the thread topic. This helps
            others find information and contributes to organized, productive conversations.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Share Knowledge</h2>
          <p>
            Our community grows stronger when members share their expertise. If you know the answer to a question,
            consider taking the time to share it with others who might benefit.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">No Spam or Self-Promotion</h2>
          <p>
            Avoid excessive self-promotion, spam, or repetitive content. Links and references should add value
            to the discussion and not purely serve promotional purposes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Respect Privacy</h2>
          <p>
            Do not share personal information about yourself or others. This includes addresses, phone numbers,
            email addresses, or any personally identifying details without explicit consent.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Guidelines;
