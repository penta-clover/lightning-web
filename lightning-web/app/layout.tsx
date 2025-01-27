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
          <body
            className={`antialiased overflow-hidden`}
          >
            <SpeedInsights />
            <LayoutUI>
              <Providers>{children}</Providers>
            </LayoutUI>
          </body>
        </html>
  );
}

export const metadata = {
  title: '라이트닝 - 클린한 LCK 팬 채팅',
  description: '클린한 LCK 팬 채팅',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
};