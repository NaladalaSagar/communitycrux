
import React from "react";
import Layout from "@/components/layout/Layout";
import BackButton from "@/components/navigation/BackButton";

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our community forum.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>
            We may collect information that you provide directly to us, such as when you create an account, 
            update your profile, post content, or communicate with us. This may include your name, email address, 
            username, password, and any other information you choose to provide.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We may use the information we collect about you for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our services;</li>
            <li>Process and complete transactions;</li>
            <li>Send you technical notices and support messages;</li>
            <li>Respond to your comments, questions, and requests;</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services;</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities;</li>
            <li>Personalize and improve the services and provide content or features that match user profiles or interests.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Sharing of Information</h2>
          <p>
            We may share your information as follows:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>With service providers who perform services on our behalf;</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process;</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of ourselves or others;</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company;</li>
            <li>With your consent or at your direction.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
