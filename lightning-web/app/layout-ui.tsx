"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import Image from "next/image";

export function LayoutUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isJoinPage = pathname.startsWith("/join");
  const isChatPage = pathname.startsWith("/chat");

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

    document.addEventListener("touchstart", preventZoom, { passive: false });
    document.addEventListener("touchmove", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("touchstart", preventZoom);
      document.removeEventListener("touchmove", preventZoom);
    };
  }, []);

  if (!isJoinPage && !isChatPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen touch-pan-x touch-pan-y">
      {/* Left Hero Image Section */}
      <div className="hidden grow lg:flex lg:w-full bg-gray-50 flex-col items-center justify-center bg-bggray">
        {/* Hero Image Placeholder */}
        <div className="flex flex-row justify-center font-semibold font-[Pretendard]">
          비난 조롱 없는 클린 스포츠챗
        </div>

        <div className="flex flex-col items-center mx-[17%] sm:mx-[30%] mb-[33px] mt-[26px]">
          <Image
            src="/icon/rightning_logo.svg"
            alt="lightning_logo"
            width={532}
            height={149}
          />
          <Image
            src="/icon/main_image.svg"
            alt="main image"
            width={480}
            height={480}
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="bg-gray-100 lg:grow-0 w-full lg:w-[min(80%,_1000px)] p-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
