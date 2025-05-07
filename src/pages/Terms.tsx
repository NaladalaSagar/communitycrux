
import React from "react";
import Layout from "@/components/layout/Layout";
import BackButton from "@/components/navigation/BackButton";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            By accessing or using our community forum, you agree to be bound by these Terms of Service. 
            Please read them carefully.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound
            by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are solely 
            responsible for the activity that occurs on your account, and you must keep your account password secure.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Content</h2>
          <p>
            You retain ownership of any content you post on our platform. However, by posting content, you grant us 
            a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify, publish, 
            and share your content in connection with our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Prohibited Conduct</h2>
          <p>
            You agree not to engage in any of the following prohibited activities: violating laws, distributing malware,
            spamming, harvesting data, or interfering with the proper functioning of our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our services immediately, without prior notice or 
            liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your 
            responsibility to check our Terms periodically for changes.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
