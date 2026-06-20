import React from "react";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using SkillSutra.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-black tracking-tight mb-8">Terms of Service</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">Last updated: June 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the SkillSutra platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Platform Integrity & AI Verification</h2>
          <p>
            You agree not to manipulate, forge, or falsely represent your Proof Score, identity, or professional experience. Any attempt to exploit or deceive the AI evaluation systems will result in an immediate and permanent ban.
          </p>
        </section>
      </div>
    </div>
  );
}
