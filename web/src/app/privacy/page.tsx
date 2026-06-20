import React from "react";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how SkillSutra protects your data and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-black tracking-tight mb-8">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">Last updated: June 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p>
            At SkillSutra, we collect information that you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, such as to facilitate skill verification, job matching, and mentorship connections.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Data Security & AI Processing</h2>
          <p>
            Our Proof Score and matching algorithms utilize AI. Your data is encrypted in transit and at rest. We do not sell your personal data to third parties.
          </p>
        </section>
      </div>
    </div>
  );
}
