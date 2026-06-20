import React from 'react';

// Reusable Organization Schema
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SkillSutra",
    "url": "https://skillsutra.com",
    "logo": "https://skillsutra.com/logo.png",
    "description": "AI-Powered Talent Verification & Hiring Platform",
    "sameAs": [
      "https://twitter.com/skillsutra",
      "https://linkedin.com/company/skillsutra"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Reusable Website Schema for internal search functionality
export function WebSiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SkillSutra",
        "url": "https://skillsutra.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://skillsutra.com/jobs?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };
    
      return (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      );
}

// Reusable Job Schema (to be imported on the Job Details page)
export function JobPostingSchema({ job }: { job: any }) {
    if (!job) return null;
    
    const schema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": job.created_at,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company?.name || "SkillSutra Partner",
            "sameAs": job.company?.website
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
            "@type": "PostalAddress",
            "addressLocality": job.location || "Remote"
            }
        },
        "employmentType": job.job_type || "FULL_TIME",
        "baseSalary": job.salary_min && job.salary_max ? {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": {
            "@type": "QuantitativeValue",
            "minValue": job.salary_min,
            "maxValue": job.salary_max,
            "unitText": "YEAR"
            }
        } : undefined
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
