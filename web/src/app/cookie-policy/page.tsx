import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Information about how SkillSutra uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Cookie Policy</h1>
        
        <p className="text-lg text-muted-foreground mb-12">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information and personalized features.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. How We Use Cookies</h2>
          <p>SkillSutra uses cookies for several reasons, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Essential operations:</strong> To authenticate users, prevent fraudulent use of login credentials, and protect user data from unauthorized parties.</li>
            <li><strong>Preferences and settings:</strong> To remember information that changes the way the site behaves or looks, such as your preferred language or the region that you are in.</li>
            <li><strong>Analytics and performance:</strong> To help us understand how visitors interact with our websites by collecting and reporting information anonymously (e.g., via Google Analytics).</li>
            <li><strong>Advertising and marketing:</strong> To deliver advertisements more relevant to you and your interests, and to measure the effectiveness of advertising campaigns.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Session Cookies:</strong> Temporary cookies that remain in the cookie file of your browser until you leave the site.</li>
            <li><strong>Persistent Cookies:</strong> Cookies that remain in the cookie file of your browser for much longer (though how long will depend on the lifetime of the specific cookie).</li>
            <li><strong>Third-Party Cookies:</strong> Cookies set by a domain other than the one being visited by the user. If you visit a website and another entity sets a cookie through that website, this would be a third-party cookie.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Your Choices Regarding Cookies</h2>
          <p>
            If you'd prefer to restrict, block, or delete cookies from SkillSutra, you can use your browser settings to do so. However, please note that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
          <p>If you have any questions about our Cookie Policy, please contact us at <a href="mailto:privacy@skillsutra.com" className="text-primary hover:underline">privacy@skillsutra.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
