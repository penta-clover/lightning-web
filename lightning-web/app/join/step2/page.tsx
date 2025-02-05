"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from "next/image";
import axios from "axios";
import clsx from "clsx";
import { condTrack } from "@/app/amplitude";
import ActionBar from "./ActionBar";

function Body() {
  const { status, update } = useSession();
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
    condTrack("click_next_tnc_signup2");

    // 토큰이 없는 경우: 비정상적인 접근
    if (status !== "authenticated") {
      router.push("/");
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.append("alarmAllowed", checkedItems.marketing ? "true" : "false");

    router.push(`/join/rule?${newParams.toString()}`);
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
      <ActionBar
        onClickBack={() => router.back()}
        onClickClose={() => router.push("/")}
      />
      <div className="relative flex flex-col h-[calc(100dvh-72px)] px-[16px]">
        <div className="flex flex-col grow">
          <h1 className="text-xl font-bold mb-[32px]">
            라이트닝 이용을 위해 동의가 필요해요
          </h1>
          <div className="flex flex-col">
            <label
              htmlFor="all"
              className="flex items-center h-[48px] border-lightgray"
            >
              <input
                type="checkbox"
                id="all"
                checked={isAllChecked}
                onChange={() => handleCheckboxChange("all")}
                className="w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none transition-all duration-50"
              />
              <label
                htmlFor="all"
                className="text-body16 text-brightblack font-bold"
              >
                전체 선택
              </label>
            </label>
            <div className="border-t-[1px] border-lightgray mt-[14px] mb-[12px] mx-[12px]"></div>
            <div className="flex justify-between items-center h-[48px] mb-[4px]">
              <label htmlFor="terms" className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={checkedItems.terms}
                  onChange={() => handleCheckboxChange("terms")}
                  className="w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none transition-all duration-50"
                />
                <label htmlFor="terms" className="text-body16 font-medium">
                  <span className="text-blue">[필수] </span>
                  <span className="text-brightblack">이용약관 동의</span>
                </label>
              </label>
              <Image
                src="/icon/chevron_right.svg"
                alt="Chevron Right"
                width={32}
                height={32}
                onClick={() => {
                  router.push(
                    "https://cac.notion.site/2faf403cf9e14d1f94f5315af8256ac3?pvs=4"
                  );
                }}
              />
            </div>
            <div className="flex justify-between items-center h-[48px] mb-[4px]">
              <label htmlFor="privacy" className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={checkedItems.privacy}
                  onChange={() => handleCheckboxChange("privacy")}
                  className="w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none transition-all duration-50"
                />
                <label htmlFor="privacy" className="text-body16 font-medium">
                  <span className="text-blue">[필수] </span>
                  <span className="text-brightblack">
                    개인정보 수집 및 이용동의
                  </span>
                </label>
              </label>
              <Image
                src="/icon/chevron_right.svg"
                alt="Chevron Right"
                width={32}
                height={32}
                onClick={() => {
                  router.push(
                    "https://cac.notion.site/f328276a7632495ba6776e1eb1234245?pvs=4"
                  );
                }}
              />
            </div>
            <label
              htmlFor="age"
              className="flex items-center h-[48px] mb-[4px]"
            >
              <input
                type="checkbox"
                id="age"
                checked={checkedItems.age}
                onChange={() => handleCheckboxChange("age")}
                className="w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none transition-all duration-50"
              />
              <label htmlFor="age" className="text-body16 font-medium">
                <span className="text-blue">[필수] </span>
                <span className="text-brightblack">만 14세 이상입니다</span>
              </label>
            </label>
            <label
              htmlFor="marketing"
              className="flex items-center h-[48px] mb-[4px]"
            >
              <input
                type="checkbox"
                id="marketing"
                checked={checkedItems.marketing}
                onChange={() => handleCheckboxChange("marketing")}
                className="w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none transition-all duration-50"
              />
              <label htmlFor="marketing" className="text-body16 font-medium">
                <span className="text-brightblack">
                  마케팅 활용 · 광고성 정보 수신 동의
                </span>
              </label>
            </label>
          </div>
        </div>
        <button
          className={clsx(
            "sticky bottom-0 px-4 py-2 my-[24px] h-[48px] bg-black text-white rounded-[10px] text-body16 active:bg-lightgray",
            {
              "bg-lightgray": !(
                checkedItems.terms &&
                checkedItems.privacy &&
                checkedItems.age
              ),
            }
          )}
          disabled={
            !(checkedItems.terms && checkedItems.privacy && checkedItems.age)
          }
          onClick={handleComplete}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}
