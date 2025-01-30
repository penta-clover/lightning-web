"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session.id) {
      // 사용자 정보가 있다면, 메인 페이지로 이동
      router.replace("/chat/room/main");
    }
  }, [status, session]);

  if (status === "authenticated" && session.id) {
    // 로그인되어 있다면, 세션에 사용자 정보가 들어있습니다

    const user = session.user;
    return (
      <div>
        <h1>Welcome, {user?.name}!</h1>
        <p>Email: {user?.email}</p>
        <LogoutButton />
      </div>
    );
  } else if (status === "loading") {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="flex h-full flex-col justify-center">
        <div className="flex flex-row justify-center font-semibold">비난 조롱 없는 클린 스포츠챗</div>

        <div className="flex flex-col items-center mx-[17%] sm:mx-[30%] mb-[33px] mt-[26px]">
          <Image src="/icon/rightning_logo.svg" alt="lightning_logo" width={532} height={149}/>
          <Image src="/icon/main_image.png" alt="main image" width={480} height={480}/>
        </div>

        <div className="flex flex-col space-y-[12px] items-center">
          <div className="flex flex-row w-full justify-center px-[24px]">
            <button
              onClick={() => {
                signIn("kakao", { redirect: false });
              }}
              className="flex flex-row grow space-x-[8px] items-center justify-center rounded-[10px] text-black text-body16 h-[48px] max-w-[447px] bg-yellow active:opacity-50"
            >
              <Image src="/icon/kakao_logo.svg" alt="google logo" width={24} height={24}/>
              <span>카카오로 빠르게 시작하기</span>
            </button>
          </div>
          <div className="flex flex-row w-full justify-center px-[24px]">
            <button
              onClick={() => {
                signIn("google", { redirect: false });
              }}
              className="flex flex-row grow space-x-[8px] items-center justify-center border-[1px] border-lightgray rounded-[10px] text-black text-body16 h-[48px] max-w-[447px] active:bg-bggray"
            >
              <Image src="/icon/google_logo.svg" alt="google logo" width={24} height={24}/>
              <span>구글 계정으로 계속하기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function LogoutButton() {
  return <button onClick={() => signOut()}>Logout</button>;
}
