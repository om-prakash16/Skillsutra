import React from "react";

export const metadata = {
  title: "Cookie Policy",
  description: "Learn how SkillSutra uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-black tracking-tight mb-8">Cookie Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-8">Last updated: June 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. What are Cookies?</h2>
          <p>
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. How SkillSutra Uses Cookies</h2>
          <p>
            When you use and access our Platform, we may place a number of cookies files in your web browser. We use cookies to enable authentication, preserve state (like your JWT tokens), provide analytics, and store your preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Third-party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service and deliver advertisements on and through the Service.
          </p>
        </section>
      </div>
    </div>
  );
}
