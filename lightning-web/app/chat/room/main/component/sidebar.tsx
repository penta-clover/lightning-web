"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

export default function Sidebar(props: { onClickCloseBtn: () => void }) {
  const router = useRouter();
  const [isInvitationCopied, setIsInvitationCopied] = useState(false);

  return (
    <div>
      <ActionBar onClickCloseBtn={props.onClickCloseBtn} />
      <div className="w-full px-[16px]">
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]"
          onClick={() => {
            setIsInvitationCopied(true);
            setTimeout(() => setIsInvitationCopied(false), 3000);
          }}
        >
          <div className="flex items-center space-x-[12px]">
            {isInvitationCopied ? (
              <>
                <Image
                  src="/icon/blue_check.svg"
                  alt="blue check"
                  width={16}
                  height={16}
                />
                <span className="text-blue text-body16 font-bold">링크 복사 완료</span></>
            ) : (
              "함께 응원할 사람 데려오기"
            )}
          </div>
        </button>
        <button className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px] channel-talk-button">
          고객 센터
        </button>
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]"
          onClick={() =>
            router.push(
              "https://cac.notion.site/2faf403cf9e14d1f94f5315af8256ac3?pvs=4"
            )
          }
        >
          운영 정책
        </button>
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]"
          onClick={() => {
            signOut();
            ChannelService.shutdown();
            router.push("/");
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

function ActionBar(props: { onClickCloseBtn: () => void }) {
  return (
    <div className="flex justify-end h-[72px]">
      <button onClick={props.onClickCloseBtn} className="px-[16px] py-[24px]">
        <Image src="/icon/close.svg" alt="Close" width={24} height={24} />
      </button>
    </div>
  );
}
