'use client';

import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Sidebar(props: { onClickCloseBtn: () => void }) {
  const router = useRouter();

  return (
    <div>
      <ActionBar onClickCloseBtn={props.onClickCloseBtn} />
      <div className="w-full px-[16px]">
        <button className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]">
          함께 응원할 사람 데려오기
        </button>
        <button className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]">
          고객 센터
        </button>
        <button className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]">
          운영 정책
        </button>
        <button
          className="block w-full flex flex-start p-[16px] border-b-[1px] border-darkgray text-darkgray h-[56px]"
          onClick={() => {
            signOut();
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
