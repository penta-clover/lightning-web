"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session.id) {
      // 사용자 정보가 있다면, 메인 페이지로 이동
      router.replace("/chat/room/main");
    }
  }, [status, session]);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof navigator === "undefined") return;
      const userAgent = navigator.userAgent || navigator.vendor;
      // 모바일 디바이스의 user agent 패턴을 검사
      if (
        /android|iphone|ipad|iPod|blackberry|windows phone/i.test(
          userAgent.toLowerCase()
        )
      ) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if ((status === "authenticated" && session.id) || status === "loading") {
    return null;
  } else {
    return (
      <div className="flex h-full flex-col justify-center">
        <div className="flex flex-col justify-center items-center font-semibold font-[Pretendard]">
          <span>스트레스 없는</span><span>새로운 LCK의 시작</span>
        </div>

        <div className="flex flex-col items-center mx-[17%] sm:mx-[30%] mb-[33px] mt-[26px]">
          <Image
            src="/icon/rightning_logo.svg"
            alt="lightning_logo"
            width={isMobile ? 532 : 320}
            height={149}
          />
          <Image
            src="/icon/main_image.svg"
            alt="main image"
            width={isMobile ? 480 : 288}
            height={480}
          />
        </div>

        <div className="flex flex-col space-y-[12px] items-center">
          <div className="flex flex-row w-full justify-center px-[24px]">
            <button
              onClick={() => {
                signIn("kakao", { redirect: false });
              }}
              className="flex flex-row grow space-x-[8px] items-center justify-center rounded-[10px] text-black text-body16 h-[48px] max-w-[447px] bg-yellow active:opacity-50"
            >
              <Image
                src="/icon/kakao_logo.svg"
                alt="google logo"
                width={24}
                height={24}
              />
              <span>카카오로 빠르게 시작하기</span>
            </button>
          </div>
          <div className="flex flex-row w-full justify-center px-[24px]">
            <button
              onClick={() => {
                signIn("google", { redirect: false });
              }}
              className="flex flex-row grow space-x-[8px] items-center justify-center border-[1px] border-lightgray rounded-[10px] text-black text-body16 h-[48px] max-w-[447px] active:bg-bggray"
            >
              <Image
                src="/icon/google_logo.svg"
                alt="google logo"
                width={24}
                height={24}
              />
              <span>Google 계정으로 계속하기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
