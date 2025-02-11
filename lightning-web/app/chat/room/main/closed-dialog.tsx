import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ClosedDialog(props: {
  notificationCount?: number;
  isOpened: {
    alarm: boolean;
    wable: boolean;
    preview: boolean;
  };
  onClickAlarmBtn: () => void;
  onClickWableBtn: () => void;
  onClickPreviewBtn: () => void;
}) {
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    notificationCount,
    onClickAlarmBtn,
    onClickWableBtn,
    onClickPreviewBtn,
  } = props;

  useEffect(() => {
    if (!emblaApi) return;

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

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full bg-black opacity-40" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[343px] h-[300px] rounded-[10px] px-[16px] pb-[15px] pt-[24px] flex flex-col">
        <Carousel
          orientation="horizontal"
          className="w-full h-full"
          setApi={setEmblaApi}
        >
          <CarouselContent className="h-full">
            <CarouselItem className="flex flex-col items-center h-full">
              <div className="relative text-heading20 text-black font-bold grow flex flex-col justify-center items-center">
                <span className="text-heading20 font-bold">
                  LCK 경기가 시작하고 채팅창이 열리면
                </span>
                <span className="text-heading20 font-bold">
                  깜빡하지 않게 알려드려요!
                </span>
              </div>
              <div className="text-caption14 font-normal text-gray h-[24px] mb-[6px]">
                {notificationCount !== undefined &&
                  `${notificationCount}명이 알림 기다리는 중`}
              </div>
              {props.isOpened.alarm ? (
                <OpenedButton onClickBtn={onClickAlarmBtn}>
                  채팅 시작할 때 편하게 알림 받을래요
                </OpenedButton>
              ) : (
                <ClosedButton />
              )}
            </CarouselItem>

            <CarouselItem className="flex flex-col items-center h-full">
              <div className="relative text-heading20 text-black font-bold grow flex flex-col justify-center items-center">
                <span className="text-heading20 font-bold">
                  온화한 LCK 팬들이 모인 커뮤니티,
                </span>
                <span className="text-heading20 font-bold">
                  와블에서 바로 이야기 시작할 수 있어요
                </span>
              </div>
              <div className="text-caption14 font-normal text-gray h-[24px] mb-[6px]" />
              {props.isOpened.wable ? (
                <OpenedButton onClickBtn={onClickWableBtn}>
                  클린 LCK 팬 커뮤니티, 와블 구경할래요
                </OpenedButton>
              ) : (
                <ClosedButton />
              )}
            </CarouselItem>

            <CarouselItem className="flex flex-col items-center h-full">
              <div className="relative text-heading20 text-black font-bold grow flex flex-col justify-center items-center">
                <span className="text-heading20 font-bold">
                  지난 경기 채팅을 보여드려요
                </span>
                <span className="text-heading20 font-bold">
                  어떤 채팅이 오고 갔는지
                </span>
                <span className="text-heading20 font-bold">
                  미리 볼 수 있어요
                </span>
              </div>
              <div className="text-caption14 font-normal text-gray h-[24px] mb-[6px]">
                {" "}
              </div>
              {props.isOpened.preview ? (
                <OpenedButton onClickBtn={onClickPreviewBtn}>
                  지난 경기 채팅 미리 보기
                </OpenedButton>
              ) : (
                <ClosedButton />
              )}
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* 슬라이드 인디케이터 UI (현재 슬라이드 위치 표시) */}
        <div className="flex mt-[14px] space-x-2 h650:opacity-0 flex-row justify-center">
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
    </div>
  );
}

function ClosedButton() {
  return (
    <button
      className={`flex flex-row justify-center items-center w-full h-[48px] bg-lightgray text-body16 text-darkgray font-bold rounded-[10px]`}
      disabled
    >
      <Image
        src="/icon/lock.svg"
        width={17}
        height={17}
        alt="잠금 아이콘"
        className="mr-[6px]"
      />
      <span>전 단계를 클리어해서 잠금해제</span>
    </button>
  );
}

function OpenedButton({
  children,
  onClickBtn,
}: {
  children: React.ReactNode;
  onClickBtn: () => void;
}) {
  return (
    <button
      onClick={onClickBtn}
      className={`w-full h-[48px] bg-black text-body16 text-white font-bold rounded-[10px] active:bg-opacity-50`}
    >
      {children}
    </button>
  );
}
