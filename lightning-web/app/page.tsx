"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isInteracting, setIsInteracting] = useState(false);

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

  // embla API를 통해 현재 선택된 슬라이드와 총 슬라이드 개수를 업데이트
  useEffect(() => {
    if (!emblaApi) return;

    // 슬라이드 개수를 가져옴
    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // 초기 선택 인덱스 설정 및 이벤트 구독
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const handlePointerDown = () => setIsInteracting(true);
    const handlePointerUp = () => setIsInteracting(false);

    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    return () => {
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
  
    let animationFrameId: number;
    let startTime: number | null = null;
  
    const animate = (time: number) => {
      if (!startTime) { startTime = time; }
      const elapsed = time - startTime;
      if (elapsed > 3000 && !isInteracting) {
        emblaApi.scrollNext();
        startTime = time; // 슬라이드 전환 후 타이머 리셋
      }
      animationFrameId = requestAnimationFrame(animate);
    };
  
    animationFrameId = requestAnimationFrame(animate);
  
    return () => cancelAnimationFrame(animationFrameId);
  }, [emblaApi, isInteracting]);

  useEffect(() => {
    if (!emblaApi) return;

    const firstSlide = setTimeout(() => {
      emblaApi.scrollTo(1);
    }, 500);

    return () => clearInterval(firstSlide);
  }, [emblaApi]);

  return (
    <div className="h-[calc(100dvh)] w-full">
      <div className="h-[calc(100dvh-156px)] flex flex-col justify-center items-center ">
        <Carousel
          orientation="horizontal"
          opts={{ loop: true }}
          setApi={setEmblaApi}
          className="max-w-[450px] mt-[30px] h730:mt-[40px] h700:mt-[30px] h620:mb-[20px]"
        >
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col justify-center items-center font-bold text-heading20 text-gray mb-[36px] h700:mb-[12px] h620:text-body16">
                <span className="h-[24px] h620:h-[20px]">스트레스 없는</span>
                <span className="h-[24px] h620:h-[20px]">
                  새로운 LCK 채팅의 시작
                </span>
              </div>

              <div className="flex flex-col items-center">
                <Image
                  src="/icon/rightning_signboard.svg"
                  alt="lightning_logo"
                  width={300}
                  height={149}
                  className="mb-[41px] h670:mb-[20px]"
                />
                <Image
                  src="/icon/main_image.svg"
                  alt="main image"
                  width={320}
                  height={480}
                />
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="flex flex-col justify-center items-center font-bold text-heading24 text-black mb-[36px] h700:mb-[12px] h620:mb-[6px] h620:text-heading20">
                <span className="h-[36px] h620:h-[24px]">10년차 LCK팬이</span>
                <span className="h-[36px] h620:h-[24px]">
                  유튜브 채팅에 지쳐 만들었어요
                </span>
              </div>
              <UserVoices />
            </CarouselItem>

            <CarouselItem>
              <div className="flex flex-col justify-center items-center font-bold text-heading24 text-black mb-[36px] h700:mb-[12px] h620:mb-[6px] h620:text-heading20 h600:hidden">
                <span className="h-[36px] h620:h-[24px]">
                  분탕이나 조롱하는 사람들을
                </span>
                <span className="h-[36px] h620:h-[24px]">
                  즉각적으로 안볼 수 있어요
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="/main_black_magic.svg"
                  alt="do lightning"
                  width={321}
                  height={378}
                  priority
                  className="mb-[41px] h670:mb-[20px]"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        {/* 슬라이드 인디케이터 UI (현재 슬라이드 위치 표시) */}
        <div className="flex space-x-2 h650:opacity-0">
          {scrollSnaps.map((_, index) => (
            <div
              key={index}
              className={`w-[8px] h-[8px] rounded-full transition-colors duration-200 ${
                index === selectedIndex ? "bg-gray" : "bg-lightgray"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-[12px] items-center bg-white h-[156px] my-[24px]">
        <div className="flex flex-row w-full justify-center px-[24px]">
          <button
            onClick={() => {
              signIn("kakao", { redirect: false });
            }}
            className="flex flex-row grow space-x-[8px] items-center justify-center rounded-[10px] text-black text-body16 h-[48px] max-w-[450px] bg-yellow active:opacity-50"
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
            className="flex flex-row grow space-x-[8px] items-center justify-center border-[1px] border-lightgray rounded-[10px] text-black text-body16 h-[48px] max-w-[450px] active:bg-bggray"
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

const UserVoices = React.memo(function UserVoices(): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="relative self-end mr-[-15px] rounded-[24px] w-[343px] bg-bggray mb-[30px]">
        <div className="flex flex-col justify-center h-[78px] ml-[24px] text-black text-body16 font-medium">
          <div>매일 상대팀 선수를 욕 하기만 하고</div>
          <div>일방적인 비하만 오가니... 너무 지쳐요.</div>
        </div>

        <Image
          src="/icon/imogi_tired.svg"
          width={48}
          height={48}
          alt="Emoji"
          className="absolute left-[264px] top-[57px] rounded-full"
        />
      </div>

      <div className="relative self-start ml-[-15px] rounded-[24px] w-[318px] bg-bggray mb-[30px]">
        <div className="flex flex-col justify-center items-end h-[78px] mr-[24px] text-black text-body16 font-medium">
          <div>갈라치기, 갈드컵을 지켜보는게</div>
          <div>너무 스트레스에요.</div>
        </div>

        <Image
          src="/icon/imogi_stressful.svg"
          width={48}
          height={48}
          alt="Emoji"
          className="absolute right-[232px] top-[53px] rounded-full"
        />
      </div>

      <div className="relative self-end mr-[-15px] rounded-[24px] w-[343px] bg-bggray mb-[30px]">
        <div className="flex flex-col justify-center h-[78px] ml-[24px] text-black text-body16 font-medium">
          <div>e-스포츠에도 클린한 팬 문화가</div>
          <div>정착했으면 좋겠어요.</div>
        </div>

        <Image
          src="/icon/imogi_sad.svg"
          width={48}
          height={48}
          alt="Emoji"
          className="absolute left-[246px] top-[54px] rounded-full"
        />
      </div>

      <div className="h-[24px]"></div>
    </div>
  );
});
