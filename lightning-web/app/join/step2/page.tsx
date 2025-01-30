"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
import axios from "axios";
import clsx from "clsx";

function Body() {
  const { status, update } = useSession();
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [checkedItems, setCheckedItems] = useState({
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  });

  const isAllChecked = Object.values(checkedItems).every(Boolean);

  const handleComplete = async () => {
    setIsJoining(true);

    // 토큰이 없는 경우: 비정상적인 접근
    if (status !== "authenticated") {
      router.push("/");
      return;
    }

    try {
      const response = await axios.post(
        "/api/member/join",
        {
          nickname: searchParams.get("nickname"),
          socialType: searchParams.get("socialType"),
          socialId: searchParams.get("socialId"),
          email: searchParams.get("email"),
          alarmAllowed: checkedItems.marketing,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 201) {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        router.back();
        return;
      }

      await update();
      router.replace("/chat/room/main");
    } catch (error) {
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      router.back();
      return;
    }

    setIsJoining(false);
  };

  const handleCheckboxChange = (
    key: "all" | "terms" | "privacy" | "age" | "marketing"
  ) => {
    if (key === "all") {
      const newValue = !isAllChecked;
      setCheckedItems({
        terms: newValue,
        privacy: newValue,
        age: newValue,
        marketing: newValue,
      });
    } else {
      setCheckedItems((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  return (
    <div className="h-full">
      <ActionBar />
      <div className="flex flex-col justify-between h-[calc(100%-72px)] px-[16px]">
        <div className="flex flex-col grow">
          <h1 className="text-xl font-bold mb-[32px]">
            서비스 이용을 위해 약관에 동의해주세요
          </h1>
          <div className="flex flex-col">
            <div className="flex items-center h-[56px] border-b-[1px] border-darkgray">
              <input
                type="checkbox"
                id="all"
                checked={isAllChecked}
                onChange={() => handleCheckboxChange("all")}
                className="mr-3 w-[24px] h-[24px] border-0 bg-bggray rounded-full checked:bg-[url('/icon/circle_checkbox.svg')] checked:border-blue-500 appearance-none"
              />
              <label
                htmlFor="all"
                className="text-body16 text-darkgray font-bold"
              >
                모든 항목에 동의합니다
              </label>
            </div>
            <div className="flex justify-between items-center h-[48px]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={checkedItems.terms}
                  onChange={() => handleCheckboxChange("terms")}
                  className="mr-3 w-[24px] h-[24px] border-0 bg-bggray rounded-full checked:bg-[url('/icon/circle_checkbox.svg')] checked:border-blue-500 appearance-none"
                />
                <label htmlFor="terms" className="text-body16">
                  <span className="text-blue font-bold">[필수] </span>
                  <span className="text-darkgray">이용약관 동의</span>
                </label>
              </div>
              <Image
                src="/icon/chevron_right.svg"
                alt="Chevron Right"
                width={36}
                height={48}
                className="py-[12px] pl-[12px]"
                onClick={() => {
                  router.push("https://cac.notion.site/2faf403cf9e14d1f94f5315af8256ac3?pvs=4")
                }}
              />
            </div>
            <div className="flex justify-between items-center h-[48px]">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={checkedItems.privacy}
                  onChange={() => handleCheckboxChange("privacy")}
                  className="mr-3 w-[24px] h-[24px] border-0 bg-bggray rounded-full checked:bg-[url('/icon/circle_checkbox.svg')] checked:border-blue-500 appearance-none"
                />
                <label htmlFor="privacy" className="text-body16">
                  <span className="text-blue font-bold">[필수] </span>
                  <span className="text-darkgray">개인정보 수집 및 이용동의</span>
                </label>
              </div>
              <Image
                src="/icon/chevron_right.svg"
                alt="Chevron Right"
                width={36}
                height={48}
                className="py-[12px] pl-[12px]"
                onClick={() => {
                  router.push("https://cac.notion.site/f328276a7632495ba6776e1eb1234245?pvs=4")
                }}
              />
            </div>
            <div className="flex items-center h-[48px]">
              <input
                type="checkbox"
                id="age"
                checked={checkedItems.age}
                onChange={() => handleCheckboxChange("age")}
                className="mr-3 w-[24px] h-[24px] border-0 bg-bggray rounded-full checked:bg-[url('/icon/circle_checkbox.svg')] checked:border-blue-500 appearance-none"
              />
              <label htmlFor="age" className="text-body16">
                <span className="text-blue font-bold">[필수] </span>
                <span className="text-darkgray">만 14세 이상입니다</span>
              </label>
            </div>
            <div className="flex items-center h-[48px]">
              <input
                type="checkbox"
                id="marketing"
                checked={checkedItems.marketing}
                onChange={() => handleCheckboxChange("marketing")}
                className="mr-3 w-[24px] h-[24px] border-0 bg-bggray rounded-full checked:bg-[url('/icon/circle_checkbox.svg')] checked:border-blue-500 appearance-none"
              />
              <label htmlFor="marketing" className="text-body16">
                <span className="text-blue font-bold">[선택] </span>
                <span className="text-darkgray">
                  마케팅 활용 · 광고성 정보 수신 동의
                </span>
              </label>
            </div>
          </div>
        </div>
        <button
          className={clsx(
            "px-4 py-2 my-[24px] h-[48px] bg-black text-white rounded-[10px] text-body16 active:bg-lightgray",
            {
              "bg-lightgray": !(
                checkedItems.terms &&
                checkedItems.privacy &&
                checkedItems.age
              ),
            }
          )}
          disabled={
            !(checkedItems.terms && checkedItems.privacy && checkedItems.age) ||
            isJoining
          }
          onClick={handleComplete}
        >
          채팅 시작하기
        </button>
      </div>
    </div>
  );
}

const ActionBar = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full h-[72px] bg-white">
      {/* 뒤로가기 버튼 */}
      <Image src="/icon/arrow_back.svg" alt="Back" width={56} height={72} onClick={() => router.back()} className="px-[16px] py-[24px]"/>

      {/* 제목 */}
      <h1 className="text-lg font-semibold"></h1>

      {/* 닫기 버튼 */}
      <Image src="/icon/close.svg" alt="Close" width={56} height={72} onClick={() => router.push("/")} className="px-[16px] py-[24px]"/>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}
