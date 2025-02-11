"use client";

import { condTrack } from "@/app/amplitude";
import ClosedDialog from "./closed-dialog";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClosedDialogContainer() {
  // get cur member id
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notificationCount, setNotificationCount] = useState<
    number | undefined
  >();
  const [isOpened, setIsOpened] = useState<{
    alarm: boolean;
    wable: boolean;
    preview: boolean;
  }>({
    alarm: true,
    wable: false,
    preview: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      // 사용자 정보가 없다면, 첫 페이지로 이동
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    axios.get("/api/notification/click").then((res) => {
      if (res.status !== 200) {
        console.error("Failed to get notification count");
      }

      setNotificationCount(res.data.content.count);
    });
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const memberId = session.id as string;

    axios
      .get(`/api/member/${memberId}/achievements?name=click_join_alarm`)
      .then((res) => {
        if (res.data.hasAchieved) {
          setIsOpened((prev) => ({
            ...prev,
            wable: true,
          }));
        }
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get(`/api/member/${memberId}/achievements?name=click_join_wable`)
      .then((res) => {
        if (res.data.hasAchieved) {
          setIsOpened((prev) => ({
            ...prev,
            preview: true,
          }));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [status, session]);

  const recordAchievement = useCallback(
    (name: string) => {
      if (status !== "authenticated") {
        return;
      }

      const memberId = session.id as string;

      axios
        .post(`/api/member/${memberId}/achievements`, {
          name,
        })
        .then((res) => {
          if (res.status !== 200) {
            console.error("Failed to record achievement");
          }

          const key = {
            click_join_alarm: "wable",
            click_join_wable: "preview",
          }[name];

          if (!key) {
            return;
          }

          setIsOpened((prev) => ({
            ...prev,
            [key]: true,
        }));
      });
    },
    [status, session]
  );

  return (
    <ClosedDialog
      notificationCount={notificationCount}
      isOpened={isOpened}
      onClickAlarmBtn={() => {
        condTrack("click_join_alarm"); // amplitude
        recordAchievement("click_join_alarm"); // record achievement
        axios.post("/api/notification/click"); // count click
        window.open(
          "https://open.kakao.com/o/gn2wNRdh",
          "_blank",
          "noopener,noreferrer"
        );
      }}
      onClickWableBtn={() => {
        condTrack("click_join_community"); // amplitude
        recordAchievement("click_join_wable"); // record achievement
        window.open("https://litt.ly/wable", "_blank", "noopener,noreferrer");
      }}
      onClickPreviewBtn={() => {
        condTrack("click_look_latestchat"); // amplitude
        recordAchievement("click_preview_chat"); // record achievement
        router.push("/chat/preview");
      }}
    />
  );
}
