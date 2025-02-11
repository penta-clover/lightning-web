"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ActionBar from "./ActionBar";
import { Suspense, useState } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { condTrack } from "@/app/amplitude";
import axios from "axios";

function Body() {
  const { status, update } = useSession();
  const searchParams = useSearchParams();

  const router = useRouter();

  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [checkedItems, setCheckedItems] = useState({
    rule1: false,
    rule2: false,
    rule3: false,
  });

  const [bluredItems, setBluredItems] = useState({
    rule1: false,
    rule2: true,
    rule3: true,
  });

  const handleCheckboxChange = (key: "rule1" | "rule2" | "rule3") => {
    if (bluredItems[key]) {
      return;
    }

    const isChecked = !checkedItems[key];

    if (isChecked) {
      const nextRule = { rule1: "rule2", rule2: "rule3", rule3: null }[key];

      if (nextRule) {
        setBluredItems((prev) => ({
          ...prev,
          [nextRule]: false,
        }));
      }
    }

    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleComplete = async () => {
    setIsJoining(true);
    condTrack("click_complete_rules_signup3");

    // 토큰이 없는 경우: 비정상적인 접근
    if (status !== "authenticated") {
      router.push("/");
      return;
    }

    try {
      const nullIfEmpty = (value: string | null) =>
        value === "" ? null : value;

      const response = await axios.post(
        "/api/member/join",
        {
          nickname: searchParams.get("nickname"),
          socialType: searchParams.get("socialType"),
          socialId: searchParams.get("socialId"),
          email: searchParams.get("email"),
          alarmAllowed: searchParams.get("alarmAllowed") === "true",
          name: searchParams.get("name"), // 이름 추가
          gender: nullIfEmpty(searchParams.get("gender")),
          birthYear: searchParams.get("birthYear"),
          phoneNumber: nullIfEmpty(searchParams.get("phoneNumber")),
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
  };

  const isAllChecked = checkedItems.rule1 && checkedItems.rule2 && checkedItems.rule3;

  return (
    <div className="h-full">
      <ActionBar
        onClickBack={() => router.back()}
        onClickClose={() => router.push("/")}
      />
      <div className="relative flex flex-col h-[calc(100dvh-72px)] px-[16px]">
        <div className="flex flex-col grow">
          <h1 className="text-xl font-bold mb-[32px]">
            라이트닝 회원이라면 지켜야 할 수칙!
          </h1>
          <div className="flex flex-col space-y-[16px]">
            <label key={`rule1-${bluredItems.rule1}`} htmlFor="rule1" className={`flex items-center h-[48px] ${bluredItems.rule1 ? "blur-[6px]" : "blur-none"}`}>
              <input
                type="checkbox"
                id="rule1"
                checked={checkedItems.rule1}
                onChange={() => handleCheckboxChange("rule1")}
                className="w-[24px] min-w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none"
              />
              <div className="text-body16 font-medium grow mr-[4px]">
                <div className="text-brightblack break-all">
                  데스크탑, 노트북에서 라이트닝을 사용해주세요! 모바일에서는
                  사용하기 어려워요.
                </div>
              </div>
            </label>
            <label key={`rule2-${bluredItems.rule2}`} htmlFor="rule2" className={`flex items-center h-[48px] ${bluredItems.rule2 ? "blur-[6px]" : "blur-none"}`}>
              <input
                type="checkbox"
                id="rule2"
                checked={checkedItems.rule2}
                onChange={() => handleCheckboxChange("rule2")}
                className="w-[24px] min-w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none"
              />
              <div className="text-body16 font-medium grow mr-[4px]">
                <div className="text-brightblack break-all shadown:none">
                  LCK 경기에서 방송 송출 후, 밴픽 시작부터 경기 종료까지에만
                  채팅창이 운영돼요
                </div>
              </div>
            </label>
            <label key={`rule3-${bluredItems.rule3}`} htmlFor="rule3" className={`flex items-start h-[48px] ${bluredItems.rule3 ? "blur-[6px]" : "blur-none"}`}>
              <input
                type="checkbox"
                id="rule3"
                checked={checkedItems.rule3}
                onChange={() => handleCheckboxChange("rule3")}
                className="w-[24px] min-w-[24px] h-[24px] m-[12px] border-0 bg-bggray rounded-[4px] bg-[url('/icon/gray_checkbox.svg')] checked:bg-[url('/icon/black_checkbox.svg')] checked:border-blue-500 appearance-none"
              />
              <div className="text-body16 font-medium grow mr-[4px]">
                <div className="text-brightblack break-all">
                  마지막으로 가장 중요한 점! 라이트닝은 기존 LCK 채팅에서 과한
                  비난과 조롱, 쓸데없는 채팅을 지양하고 있어요. 편하면서도
                  유쾌한 환경을 위해 함께 노력해주세요
                </div>
              </div>
            </label>
          </div>
        </div>
        <button
          className={clsx(
            "sticky bottom-0 px-4 py-2 my-[24px] h-[48px] bg-black text-white rounded-[10px] text-body16 active:bg-lightgray font-bold",
            {
              "bg-lightgray": !isAllChecked || isJoining,
            }
          )}
          disabled={
            !(checkedItems.rule1 && checkedItems.rule2 && checkedItems.rule3) ||
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

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}
