import "./globals.css";
import { Providers } from "@/app/providers";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { LayoutUI } from "./layout-ui";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en">
          <title>라이트닝 - 클린한 LCK 팬 채팅</title>
          <meta name="description" content="클린한 LCK 팬 채팅" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <body
            className={`antialiased overflow-hidden safe-area`}
          >
            <SpeedInsights />
            <LayoutUI>
              <Providers>{children}</Providers>
            </LayoutUI>
          </body>
        </html>
  );
}