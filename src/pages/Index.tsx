
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import RecentDiscussionsSection from "@/components/home/RecentDiscussionsSection";
import CtaSection from "@/components/home/CtaSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedSection />
      <CategoriesSection />
      <RecentDiscussionsSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
