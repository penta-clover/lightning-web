"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function Body() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState(false);
  const [isNicknameUnique, setIsNicknameUnique] = useState<boolean | undefined>(
    undefined
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleComplete = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.append("nickname", nickname);

    router.push(`/join/step2?${newParams.toString()}`);
  };

  const censorNickname = (value: string) => {
    if (value.length > 8) return false;
    if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/.test(value)) return false;

    return true;
  };

  const validateNickname = (value: string) => {
    if (value.length < 1) return false;
    if (value.length > 8) return false;
    if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/.test(value)) return false;

    return true;
  };

  const checkNicknameUnique = async (nickname: string) => {
    setIsChecking(true);

    const response = await fetch(`/api/member/nickname/${nickname}`);
    if (response.status == 200) {
      setIsNicknameUnique(false);
    } else {
      setIsNicknameUnique(true);
    }

    setIsChecking(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNicknameUnique(undefined);
    const value = e.target.value;

    if (censorNickname(value)) {
      setIsNicknameValid(validateNickname(value));
      setNickname(value);
    } else {
      setIsNicknameValid(validateNickname(nickname));
    }
  };

  return (
    <div className="h-full">
      <ActionBar />
      <div className="flex flex-col justify-between h-[calc(100%-72px)] px-[16px]">
        <div className="flex flex-col grow">
          <label
            htmlFor="nickname"
            className="text-heading24 text-black font-bold mb-[28px] block"
          >
            사용할 닉네임을 입력해주세요
          </label>
          <div className="flex items-center space-x-[8px]">
            <div className="inline-block relative w-full">
                <input
                type="text"
                id="nickname"
                value={nickname}
                onInput={handleInput}
                placeholder="닉네임을 입력하세요"
                disabled={isChecking}
                className={clsx("flex-1 w-full px-[16px] py-[12px] text-body16 border-b border-gray-300 rounded-t-[4px] rounded-b-[0px] bg-bggray focus:outline-none focus:ring-0",
                    {"border-red text-red": isNicknameUnique === false},)}
                />
                <div className={clsx("absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer", {"hidden": isNicknameUnique !== false})}>
                    <Image src="/icon/error_circle.svg" alt="불가 표시" width={24} height={24}></Image>
                </div>
            </div>
            <button
              onClick={() => {
                checkNicknameUnique(nickname);
              }}
              className={`py-2 w-[50px] text-darkgray text-caption12 rounded-md flex items-center justify-center`}
              disabled={isChecking}
            >
              { isChecking ? <Image src="/icon/rolling_spinner.gif" alt="로딩 스피너" width={24} height={24} /> : "중복확인"}
            </button>
          </div>
          <div
            className={clsx("text-darkgray text-caption12 px-[16px] py-[4px]", {
              hidden: isNicknameUnique !== undefined,
            })}
          >
            8자리 이내, 문자/숫자로 입력 가능해요
          </div>
          <div
            className={clsx("text-red text-caption12 px-[16px] py-[4px]", {
              hidden: isNicknameUnique !== false,
            })}
          >
            사용할 수 없는 닉네임입니다.
          </div>
          <div
            className={clsx(
              "flex space-x-[4px] text-blue text-caption12 px-[16px] py-[4px]",
              { hidden: isNicknameUnique !== true }
            )}
          >
            <Image
              src="/icon/blue_check.svg"
              alt="확인 표시"
              width={16}
              height={16}
            />
            <span>사용 가능한 닉네임입니다.</span>
          </div>
        </div>

        <button
          className={clsx("px-4 py-2 my-[24px] h-[48px] bg-black text-white rounded-[10px]",
            {"bg-lightgray text-body16": !(isNicknameValid && isNicknameUnique)},
          )}
          disabled={!(isNicknameValid && isNicknameUnique)}
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

const ActionBar = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between w-full h-[72px] bg-white">
      {/* 뒤로가기 버튼 */}
      <Image src="/icon/arrow_back.svg" alt="Back" width={56} height={72} onClick={() => router.push("/")} className="px-[16px] py-[24px]"/>

      {/* 제목 */}
      <h1 className="text-lg font-semibold"></h1>

      {/* 닫기 버튼 */}
      <Image src="/icon/close.svg" alt="Close" width={56} height={72} onClick={() => router.push("/")} className="px-[16px] py-[24px]"/>
    </div>
  );
};
