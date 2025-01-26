'use client';

import { usePathname } from "next/navigation";

export function LayoutUI({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");
  
    if (isAdminPage) {
      return <>{children}</>;
    }
  
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