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
            className={`antialiased`}
          >
            <SpeedInsights />
            <LayoutUI>
              <Providers>{children}</Providers>
            </LayoutUI>
          </body>
        </html>
  );
}