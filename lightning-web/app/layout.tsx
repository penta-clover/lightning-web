import "./globals.css";
import { Providers } from "@/app/providers";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
            <Providers>{children}</Providers>
          </body>
        </html>
  );
}
