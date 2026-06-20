import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";

export function Analytics() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
  const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_TRACKING_ID && (
        <GoogleAnalytics gaId={GA_TRACKING_ID} />
      )}

      {/* Microsoft Clarity Placeholder */}
      {CLARITY_PROJECT_ID && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `,
          }}
        />
      )}
    </>
  );
}
