"use client";

import * as amplitude from '@amplitude/analytics-browser';
import Script from "next/script";
import { useEffect } from 'react';

export default function Analytics({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    amplitude.init('d404b8faa22b74a7fbeeb140dd0d258b', {
      autocapture: {
        elementInteractions: true
      }
    });
  }, []);

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

      {children}
    </>
  );
}
