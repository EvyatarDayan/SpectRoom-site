"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import FeatureGrid from "@/components/FeatureGrid";
import PrivacySafetySection from "@/components/PrivacySafetySection";
import OnboardingPreview from "@/components/OnboardingPreview";
import FAQ from "@/components/FAQ";
import HelpSupportSection from "@/components/HelpSupportSection";
import DownloadsSection from "@/components/DownloadsSection";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default function HomePage() {
  return (
    <div id="top" className="relative min-h-screen w-full overflow-x-clip">
      <Header />
      <main>
        <Hero />
        <SectionDivider />
        <FeatureGrid />
        <SectionDivider />
        <DownloadsSection />
        <SectionDivider />
        <OnboardingPreview />
        <SectionDivider />
        <PrivacySafetySection />
        <SectionDivider />
        <FAQ />
        <SectionDivider />
        <HelpSupportSection />
        <SectionDivider />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
