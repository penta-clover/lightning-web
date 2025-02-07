import "./globals.css";
import { Providers } from "@/app/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LayoutUI } from "./layout-ui";
import Analytics from "./analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>라이트닝 - 클린한 LCK 팬 채팅</title>
        <meta name="description" content="클린한 LCK 팬 채팅" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="color-scheme" content="light" />
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
