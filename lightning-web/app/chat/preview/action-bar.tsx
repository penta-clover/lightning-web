import Image from "next/image";
import { MouseEventHandler } from "react";

export default function ActionBar(props: {
  title: string;
  onClickMenuBtn: MouseEventHandler<HTMLButtonElement>;
  activeCount?: number;
}) {
  return (
    <div className="flex items-center justify-between w-full h-[72px] bg-white border-b-[1px] border-strokeblack">
      {/* 제목 */}
      <div className="flex flex-col items-left justify-center ml-[16px]">
        <h1 className="text-body16 font-bold">{props.title}</h1>
        <div className="flex flex-row items-center text-caption12 space-x-[5px]">
          <Image
            src="/icon/red_circle.svg"
            alt="red circle"
            width={6}
            height={6}
          />
          <span>
            {props.activeCount === undefined
              ? ""
              : `${props.activeCount}명 참여 중`}
          </span>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button onClick={props.onClickMenuBtn} className="py-[24px] px-[16px]">
        <Image src="/icon/menu.svg" alt="Menu" width={24} height={24} />
      </button>
    </div>
  );
};