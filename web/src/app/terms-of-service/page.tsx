import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the rules, guidelines, and terms for using the SkillSutra platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Terms of Service</h1>
        
        <p className="text-lg text-muted-foreground mb-12">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the SkillSutra platform ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
          <p>
            SkillSutra is an AI-powered talent verification and hiring platform. We provide tools for job seekers to verify their skills and generate Proof Scores, and for companies to discover and match with qualified talent.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate, complete, and current information when creating an account.</li>
            <li>You are responsible for safeguarding the password that you use to access the Service.</li>
            <li>You must not use as a username the name of another person or entity that is not lawfully available for use.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Content and Verification Data</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service.
          </p>
          <p className="mt-4">
            By submitting data for skill verification and Proof Score generation, you grant SkillSutra the right to process this data using our AI models to evaluate and match your qualifications. SkillSutra reserves the right to remove any Content that violates these terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of SkillSutra and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall SkillSutra, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which SkillSutra operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@skillsutra.com" className="text-primary hover:underline">legal@skillsutra.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
