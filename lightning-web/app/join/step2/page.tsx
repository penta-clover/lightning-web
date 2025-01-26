"use client";

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Image from 'next/image';
import axios from "axios";

function Body() {
  const { status } = useSession();
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
    // 토큰이 없는 경우: 비정상적인 접근
    if (status !== "authenticated") {
      router.push("/error/401");
      return;
    }

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
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.status === 201) {
      router.push("/");
    } else {
      router.push("/error/404");
    }
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
    <div className="h-screen bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">
          라이트닝 이용을 위해 동의가 필요해요
        </h1>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="all"
              checked={isAllChecked}
              onChange={() => handleCheckboxChange("all")}
              className="mr-3 w-5 h-5"
            />
            <label htmlFor="all" className="text-gray-700 font-medium">
              전체 선택
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={checkedItems.terms}
              onChange={() => handleCheckboxChange("terms")}
              className="mr-3 w-5 h-5"
            />
            <label htmlFor="terms" className="text-gray-700">
              이용약관 동의 (필수)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="privacy"
              checked={checkedItems.privacy}
              onChange={() => handleCheckboxChange("privacy")}
              className="mr-3 w-5 h-5"
            />
            <label htmlFor="privacy" className="text-gray-700">
              개인정보 수집 및 이용동의 (필수)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="age"
              checked={checkedItems.age}
              onChange={() => handleCheckboxChange("age")}
              className="mr-3 w-5 h-5"
            />
            <label htmlFor="age" className="text-gray-700">
              만 14세 이상입니다 (필수)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="marketing"
              checked={checkedItems.marketing}
              onChange={() => handleCheckboxChange("marketing")}
              className="mr-3 w-5 h-5"
            />
            <label htmlFor="marketing" className="text-gray-700">
              마케팅 활용/광고성 정보 수신동의 (선택)
            </label>
          </div>
        </div>
        <button
          className={`
            w-full mt-6 text-white py-2 px-4 rounded-md hover:bg-blue-600
            ${
              checkedItems.terms && checkedItems.privacy && checkedItems.age
                ? "bg-blue-500"
                : "bg-gray-400"
            }
          `}
          disabled={
            !(checkedItems.terms && checkedItems.privacy && checkedItems.age)
          }
          onClick={handleComplete}
        >
          완료
        </button>
      </div>
    </div>
  );
}

const ActionBar = () => {
  return (
    <div className="flex items-center justify-between w-full h-[72px] bg-white px-4">
      {/* 뒤로가기 버튼 */}
      <Image src="/icon/arrow_back.svg" alt="Back" width={24} height={24} />

      {/* 제목 */}
      <h1 className="text-lg font-semibold"></h1>

      {/* 닫기 버튼 */}
      <Image src="/icon/close.svg" alt="Close" width={24} height={24} />
    </div>
  );
};


export default function Page() {
  return <Suspense>
    <Body />
  </Suspense>
}