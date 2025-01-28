"use client";

import Script from "next/script";

export default function Analytics({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-F8TMB30295"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-F8TMB30295');
        `}
      </Script>

      {/* Amplitude */}
      <Script
        src="https://cdn.amplitude.com/script/d404b8faa22b74a7fbeeb140dd0d258b.js"
        strategy="beforeInteractive"
      />
      <Script id="amplitude-init" strategy="afterInteractive">
        {`
            window.amplitude.add(window.sessionReplay.plugin({ sampleRate: 1 }));
            window.amplitude.init('d404b8faa22b74a7fbeeb140dd0d258b', {"fetchRemoteConfig":true,"autocapture":true});
        `}
      </Script>

      {children}
    </>
  );
}
