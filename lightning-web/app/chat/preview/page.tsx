"use client";

import Image from "next/image";
import { useFirebaseApp } from "@/app/firebase-provider";
import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import {
  getFirestore,
  collection,
  query,
  doc,
  onSnapshot,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import axios from "axios";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import OthersChat from "./others-chat";
import BlockedChat from "./blocked-chat";
import InfluencerChat from "./influencer-chat";
import MyChat from "./my-chat";
import ActionBar from "./action-bar";
import LightningDialog from "./lightning-dialog";

type Lightning = {
  id: string;
  messageId: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
};

type Notification = {
  channelName: string;
  channelUrl: string;
  inviteeNickname: string;
  referrerProfileImageUrl: string;
};

export default function Page() {
  const app = useFirebaseApp();
  const db = getFirestore(app);

  const { data: session, status } = useSession();
  const router = useRouter();

  const [chatRoom, setChatRoom] = useState<{
    roomId: string;
    status: string;
  }>();
  const [chatRoomName, setChatRoomName] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [lightnings, setLightnings] = useState<Lightning[]>([]);
  const [enableSidebar, setEnableSidebar] = useState(false);
  const [chatToLightning, setChatToLightning] = useState<string>();
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  function applyBlock(chats: Chat[]) {
    const lightnedMembers = new Set(
      lightnings.map((lightning) => lightning.receiverId)
    );

    const newChats = [...chats];

    for (const chat of newChats) {
      if (lightnedMembers.has(chat.sender_id)) {
        chat.transparency = 85;
        chat.block_type = "TRANSPARENT";
        chat.profile_image_url = "/profile/lightned_profile.svg";
      }

      if (chat.sender_id === session?.id) {
        chat.transparency = 0;

        if (chat.block_type !== "DISABLED") {
          chat.block_type = "NONE";
        }
      }
    }

    return newChats;
  }

  const onClickLightning = async (chatId: string) => {
    setChatToLightning(chatId);
  };

  const onConfirmLightning = async () => {
    const chatId = chatToLightning;
    let response;

    try {
      response = await axios.post(
        `/api/chat/${chatId}/lightning`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (e) {
      alert("탈퇴한 유저입니다.");
      return;
    }

    setLightnings([...lightnings, response.data]);
    setChatToLightning(undefined);
  };

  const onCancelLightning = () => {
    setChatToLightning(undefined);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated") {
      ChannelService.shutdown();
      ChannelService.boot({
        pluginKey: "3ff291f4-ea2a-411a-9a1d-1d82c1870c54",
        customLauncherSelector: ".channel-talk-button",
        hideChannelButtonOnBoot: true,
        memberId: session.id,
        profile: {
          name: session.user?.name ?? "알 수 없음",
          email: session.user?.email ?? "알 수 없음",
        },
      });
    }
  }, [session]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(
        db,
        process.env.NEXT_PUBLIC_FIRESTORE_POLICY_COLLECTION as string,
        "main_room"
      ),
      (doc) => {
        const data = doc.data();
        const roomId = data!.room_id;
        const status = data!.status;

        setChatRoom({ roomId: roomId, status: status });
      }
    );

    return unsubscribe;
  }, [db]);

  useEffect(() => {
    if (!chatRoom || !chatRoom.roomId) return;

    const docRef = doc(db, "chatrooms", chatRoom.roomId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChatRoomName(data!.name);
      }
    });

    return unsubscribe;
  }, [chatRoom]);

  useEffect(() => {
    if (!chatRoom) return;

    const q = query(
      collection(db, "chatmessages"),
      where("room_id", "==", chatRoom.roomId),
      orderBy("created_at", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newChats: Chat[] = [];

      querySnapshot.forEach((doc) => {
        newChats.push({ ...doc.data(), id: doc.id } as Chat);
      });

      setChats((prevChats) => {
        return applyBlock(newChats);
      });
    });

    return unsubscribe;
  }, [db, chatRoom, lightnings]);

  useEffect(() => {
    setChats(applyBlock(chats));
  }, [lightnings]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    axios
      .get("/api/chat/lightning/my", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setLightnings(response.data.lightnings);
      });
  }, [session, status]);

  return (
    <div className="relative">
      <div
        className={`absolute top-0 right-0 w-full h-full ${
          chatToLightning
            ? "opacity-100 z-50 transition-opacity"
            : "opacity-0 -z-50"
        }`}
      >
        <LightningDialog
          onClickConfirm={onConfirmLightning}
          onClickCancel={onCancelLightning}
        />
      </div>
      <div
        className={"flex flex-col w-full h-[calc(100dvh)] pb-0 relative"}
      >
        <ActionBar
          title={chatRoomName}
          activeCount={0}
          onClickMenuBtn={() => setEnableSidebar(true)}
        />
        {/* 채팅 메시지 컨테이너 */}
        <div className="flex-1 w-full overflow-y-auto scrollbar-hide bg-gray-100 p-4 grow flex flex-col-reverse transition-all">
          {chats.map((chat, index) => {
            switch (chat.block_type) {
              case "NONE":
              case "TRANSPARENT":
                return (
                  <div
                    key={index}
                    className={`flex mb-4 w-full ${
                      chat.sender_id === session?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    style={{ opacity: (100 - chat.transparency) / 100 }}
                  >
                    {(() => {
                      if (chat.sender_id === session?.id) {
                        return <MyChat chat={chat} />;
                      } else if (chat.chat_type === "INFLUENCER") {
                        return (
                          <InfluencerChat
                            chat={chat}
                            onClickLightning={onClickLightning}
                            onClickLink={() => {
                              chat.optional?.channel_url
                                ? window.open(
                                    chat.optional.channel_url,
                                    "_blank",
                                    "noopener,noreferrer"
                                  )
                                : null;
                            }}
                          />
                        );
                      } else {
                        return (
                          <OthersChat
                            chat={chat}
                            onClickLightning={onClickLightning}
                          />
                        );
                      }
                    })()}
                  </div>
                );
              case "BLOCKED":
                return (
                  <div key={index} className={"flex mb-4 w-full justify-start"}>
                    <BlockedChat key={index} chat={chat} />
                  </div>
                );
              case "INVISIBLE":
              case "DISABLED":
                return <div key={index}></div>;
            }
          })}
        </div>
        {/* 메시지 입력창 */}
        <div className="sticky w-full bottom-0 flex items-end px-[16px] py-[12px] bg-bggray">
          <textarea
            ref={chatInputRef}
            disabled
            placeholder="종료된 채팅방입니다."
            className="flex-1 p-2 border-[1px] border-lightgray text-body16 rounded resize-none overflow-hidden min-h-[42px] max-h-[6rem] h-auto focus:border-[1px] focus:border-lightgray"
            rows={1}
            maxLength={280}
            style={{
              lineHeight: "1.5rem",
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => alert("종료된 채팅방입니다.")}
            className={clsx(
              "flex ml-[8px] justify-center items-center w-[42px] h-[42px] text-white rounded-[10.5px] hover:bg-blue-600",
              false ? "bg-black" : "bg-lightgray"
            )}
            disabled={true}
          >
            {false ? (
              <Image
                src="/icon/white_rolling_spinner.gif"
                alt="spinner"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src="/icon/upload.svg"
                alt="upload"
                width={17}
                height={17}
              />
            )}
          </button>
        </div>
      </div>
      <div
        className={clsx(
          "absolute top-0 right-0 w-full h-full bg-white z-50 transition-all",
          enableSidebar ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Sidebar onClickCloseBtn={() => setEnableSidebar(false)} />
      </div>
    </div>
  );
}
