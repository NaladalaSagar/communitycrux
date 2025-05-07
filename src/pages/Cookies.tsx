
import React from "react";
import Layout from "@/components/layout/Layout";
import BackButton from "@/components/navigation/BackButton";

const Cookies = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BackButton label="Back to Home" className="mb-6" />
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our 
            community forum. It explains what these technologies are and why we use them, as well as your rights to 
            control our use of them.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
            as well as to provide reporting information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Do We Use Cookies?</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
            reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" 
            cookies. Other cookies also enable us to track and target the interests of our users to enhance the 
            experience on our website. Third parties serve cookies through our website for advertising, analytics 
            and other purposes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Essential cookies:</strong> These cookies are strictly necessary to provide you with services 
            available through our website and to use some of its features, such as access to secure areas.</li>
            <li><strong>Performance cookies:</strong> These cookies collect information about how you use a website, 
            like which pages you visited and which links you clicked on.</li>
            <li><strong>Functionality cookies:</strong> These cookies allow the website to remember choices you make 
            (such as your username, language, or the region you're in) and provide enhanced features.</li>
            <li><strong>Targeting cookies:</strong> These cookies are used to deliver advertisements more relevant to 
            you and your interests.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How to Control and Delete Cookies</h2>
          <p>
            Most web browsers allow some control of most cookies through the browser settings. To find out more about 
            cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" 
            target="_blank" rel="noopener noreferrer">aboutcookies.org</a> or 
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">allaboutcookies.org</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;
