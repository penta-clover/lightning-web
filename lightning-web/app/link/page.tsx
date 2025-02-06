"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Cookies from "js-cookie";

function Body() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
  const router = useRouter();

  // 레퍼럴 링크라면 요청을 기록함
  useEffect(() => {
    if (!referralCode) {
      return;
    }

    axios
      .post("/api/referral/log", {
        referralCode: referralCode,
        event: "index_page_first_view",
      })
      .then(() => {
        console.log("referral log saved");
        Cookies.set("referralCode", referralCode, { expires: 1, path: "/" });
        router.replace("/");
      })
      .catch((error) => {
        router.replace("/");
      });
  }, []);

  return <div></div>;
}

export default function Page() {
  return (
    <Suspense>
      <Body />
    </Suspense>
  );
}
