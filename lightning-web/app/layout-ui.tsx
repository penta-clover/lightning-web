'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

export function LayoutUI({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    ChannelService.loadScript();
  
    if (isAdminPage) {
      return <>{children}</>;
    }

    // block pinch zoom on mobile
    useEffect(() => {
      const preventZoom = (e: TouchEvent) => {
        if (e.touches && e.touches.length > 1) {
          e.preventDefault();
        }
      };
    
      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('touchmove', preventZoom, { passive: false });
    
      return () => {
        document.removeEventListener('touchstart', preventZoom);
        document.removeEventListener('touchmove', preventZoom);
      };
    }, []);
    
    return (
      <div className="flex h-screen w-screen touch-pan-x touch-pan-y">
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