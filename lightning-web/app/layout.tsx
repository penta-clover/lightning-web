import "./globals.css";
import { Providers } from "@/app/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LayoutUI } from "./layout-ui";
import Analytics from "./analytics";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "./static/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable}`}>
      <head>
        <title>라이트닝 - 클린한 LCK 팬 채팅</title>
        <meta name="description" content="클린한 LCK 팬 채팅" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`antialiased overflow-hidden safe-area`}>
        <SpeedInsights />
        <Analytics>
          <Providers>
            <LayoutUI>{children}</LayoutUI>
          </Providers>
        </Analytics>
      </body>
    </html>
  );
}
