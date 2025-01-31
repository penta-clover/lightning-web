"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

export default function Sidebar(props: { onClickCloseBtn: () => void }) {
  const router = useRouter();
  const [isInvitationCopied, setIsInvitationCopied] = useState(false);

  const copyInvitation = () => {
    const textToCopy = "https://bit.ly/4gjRvKl";
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div>
      <ActionBar onClickCloseBtn={props.onClickCloseBtn} />
      <div className="w-full px-[16px]">
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px] active:bg-lightgray hover:bg-bggray"
          onClick={() => {
            copyInvitation();
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
        <button className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px] active:bg-lightgray hover:bg-bggray channel-talk-button">
          고객 센터
        </button>
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px] active:bg-lightgray hover:bg-bggray"
          onClick={() =>
            router.push(
              "https://cac.notion.site/9ad4c98e96ab4c6d84bd522e54cee25f?pvs=4"
            )
          }
        >
          운영 정책
        </button>
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px] active:bg-lightgray hover:bg-bggray"
          onClick={() =>
            router.push(
              "https://docs.google.com/forms/d/e/1FAIpQLSfpNGEumVNGg8vcuu6lGc5LBBkwLzuevuvC51dxffkZT2sdbA/viewform"
            )
          }
        >
          의견 남기기
        </button>
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px] active:bg-lightgray hover:bg-bggray"
          onClick={async () => {
            ChannelService.shutdown();
            await signOut({ callbackUrl: "/" });
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
