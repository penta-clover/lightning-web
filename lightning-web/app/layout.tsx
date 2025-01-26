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
            <LayoutUI>
              <Providers>{children}</Providers>
            </LayoutUI>
          </body>
        </html>
  );
}


function LayoutUI({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      {/* Left Hero Image Section */}
      <div className="hidden grow lg:flex lg:w-full bg-gray-50 items-center justify-center">
        {/* Hero Image Placeholder */}
        <span className="text-2xl font-bold">클린한 커뮤니티!</span>
      </div>

      {/* Right Content Section */}
      <div className="bg-gray-100 lg:grow-0 w-full lg:w-[min(80%,_1000px)] p-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}