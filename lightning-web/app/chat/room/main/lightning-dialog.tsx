import Image from "next/image";
import { useState } from "react";

export default function LightningDialog(props: {
    onClickConfirm: () => Promise<void>;
    onClickCancel: () => void;
  }) {
    const [isSendingLightning, setIsSendingLightning] = useState(false);
  
    const onClickConfirmBtn = async () => {
      setIsSendingLightning(true);
      await props.onClickConfirm();
      setIsSendingLightning(false);
    };
  
    return (
      <div className="relative w-full h-full">
        <div
          className="w-full h-full bg-black opacity-40"
          onClick={props.onClickCancel}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[343px] rounded-[10px] flex flex-col items-center justify-center px-[16px] pt-[32px] pb-[12px]">
          <h1 className="text-heading24 text-black font-bold">
            라이트닝 적용하기
          </h1>
          <Image
            src="/icon/main_image.svg"
            alt="라이트닝 당하는 해골"
            width={133}
            height={137}
            className="my-[16px]"
          ></Image>
          <div className="text-body16 text-black text-center">
            라이트닝의 건전한 문화를 망치는
            <br />
            유저의 채팅을 바로 가려보세요!
          </div>
          <button
            onClick={onClickConfirmBtn}
            className={`w-full h-[48px] mt-[11px] bg-black text-body16 text-white font-bold rounded-[10px] ${
              isSendingLightning && "opacity-50"
            }`}
            disabled={isSendingLightning}
          >
            지금 적용하기
          </button>
          <button
            onClick={props.onClickCancel}
            className="w-full h-[42px] mb-[12px] text-body14 text-darkgray"
          >
            나중에 할게요
          </button>
        </div>
      </div>
    );
  };