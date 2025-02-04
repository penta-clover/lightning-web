"use client";

import Image from "next/image";
import { useFirebaseApp } from "@/app/firebase-provider";
import React, {
  useState,
  useEffect,
  use,
  MouseEventHandler,
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
  getDoc,
  getDocs,
} from "firebase/firestore";
import axios from "axios";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Sidebar from "./component/sidebar";
import { useRouter } from "next/navigation";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";

type Chat = {
  id: string;
  sender_id: string;
  sender_nickname: string;
  profile_image_url: string;
  content: string;
  created_at: string;
  transparency: number;
  block_type: string;
};

type Lightning = {
  id: string;
  messageId: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
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
  const [activeCount, setActiveCount] = useState<number | undefined>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lightnings, setLightnings] = useState<Lightning[]>([]);
  const [enableSidebar, setEnableSidebar] = useState(false);
  const [canSending, setCanSending] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatToLightning, setChatToLightning] = useState<string>();
  const [notificationCount, setNotificationCount] = useState<
    number | undefined
  >();
  const [isMobile, setIsMobile] = useState(false);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const sendChatMessage = async () => {
    if (!chatRoom || !inputMessage || inputMessage.trim() === "") {
      return;
    }

    const message = inputMessage.trim();
    setInputMessage("");
    setCanSending(false);
    setIsSending(true);

    // send chat message
    const response = await axios.post(
      `/api/chat/`,
      {
        content: message,
        roomId: chatRoom.roomId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setCanSending(chatInputRef.current?.value.trim() !== "");
    setIsSending(false);
  };

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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    if (textarea.value.trim().length === 0) {
      setCanSending(false);
    } else {
      setCanSending(!isSending);
    }

    // 높이를 자동으로 조정
    textarea.style.height = "auto";
    textarea.style.height =
      Math.min(Math.max(textarea.scrollHeight, 42), 96) + "px"; // 최대 높이 96px (4줄)
    setInputMessage(textarea.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (canSending === false) {
      return;
    }

    if (e.key === "Enter") {
      if (e.shiftKey || isMobile) {
        return;
      }

      e.preventDefault();
      sendChatMessage();
    }
  };

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof navigator === "undefined") return;
      const userAgent = navigator.userAgent || navigator.vendor;
      // 모바일 디바이스의 user agent 패턴을 검사
      if (
        /android|iphone|ipad|iPod|blackberry|windows phone/i.test(
          userAgent.toLowerCase()
        )
      ) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    axios.get("/api/notification/click").then((res) => {
      if (res.status !== 200) {
        console.error("Failed to get notification count");
      }

      setNotificationCount(res.data.content.count);
    });
  }, []);

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
    const unsubscribe = onSnapshot(doc(db, "policy", "main_room"), (doc) => {
      const data = doc.data();
      const roomId = data!.room_id;
      const status = data!.status;

      setChatRoom({ roomId: roomId, status: status });
    });

    return unsubscribe;
  }, [db]);

  useEffect(() => {
    if (!chatRoom || !chatRoom.roomId) return;

    const docRef = doc(db, "chatrooms", chatRoom.roomId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setActiveCount(data!.active_count);
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
        // compare doc.id is in chats
        // const exist = chats.find((chat) => chat.id === doc.id);

        // if (exist) {
        //   return;
        // }

        // newChats.push({ ...doc.data(), id: doc.id } as Chat);

        // hot fix
        newChats.push({ ...doc.data(), id: doc.id } as Chat);
      });

      setChats((prevChats) => {
        // return applyBlock([...newChats, ...prevChats]);
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
        className={`absolute top-0 right-0 w-full h-full ${
          chatRoom?.status === "RESERVED"
            ? "opacity-100 z-50 transition-opacity"
            : "opacity-0 -z-50"
        }`}
      >
        <ClosedDialog
          notificationCount={notificationCount}
          onClickAlarmBtn={() => {
            axios.post("/api/notification/click");
            router.push("https://open.kakao.com/o/gn2wNRdh");
          }}
        >
          <span>경기 방송 시작되면 오픈됩니다.</span>
          <span>잠시만 기다려주세요!</span>
        </ClosedDialog>
      </div>
      <div
        className={`absolute top-0 right-0 w-full h-full ${
          chatRoom?.status === "TERMINATED"
            ? "opacity-100 z-50 transition-opacity"
            : "opacity-0 -z-50"
        }`}
      >
        <ClosedDialog
          notificationCount={notificationCount}
          onClickAlarmBtn={() => {
            axios.post("/api/notification/click");
            router.push("https://open.kakao.com/o/gn2wNRdh");
          }}
        >
          <span>채팅방은 다음 경기 전에 오픈됩니다.</span>
          <span>다음 경기에서 봬요!</span>
        </ClosedDialog>
      </div>
      <div
        className={`flex flex-col w-full h-[calc(100dvh)] pb-0 relative ${
          (chatToLightning || chatRoom?.status !== "ACTIVE") &&
          "filter blur transition-all"
        }`}
      >
        <ActionBar
          title={chatRoomName}
          activeCount={activeCount}
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
                    {chat.sender_id === session?.id ? (
                      <MyChat chat={chat} />
                    ) : (
                      <OthersChat
                        chat={chat}
                        onClickLightning={onClickLightning}
                      />
                    )}
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
            value={inputMessage}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 border-[1px] border-lightgray text-body16 rounded resize-none overflow-hidden min-h-[42px] max-h-[6rem] h-auto focus:border-[1px] focus:border-lightgray"
            rows={1}
            maxLength={280}
            style={{
              lineHeight: "1.5rem",
            }}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={sendChatMessage}
            className={clsx(
              "flex ml-[8px] justify-center items-center w-[42px] h-[42px] text-white rounded-[10.5px] hover:bg-blue-600",
              canSending ? "bg-black" : "bg-lightgray"
            )}
            disabled={!canSending}
          >
            {isSending ? (
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

const ActionBar = (props: {
  title: string;
  onClickMenuBtn: MouseEventHandler<HTMLButtonElement>;
  activeCount?: number;
}) => {
  return (
    <div className="flex items-center justify-between w-full h-[72px] bg-white border-b-[1px] border-strokeblack">
      {/* 제목 */}
      <div className="flex flex-col items-left justify-center ml-[16px]">
        <h1 className="text-body16 font-bold">{props.title}</h1>
        <div className="flex flex-row items-center text-caption12 space-x-[5px]">
          <Image
            src="/icon/red_circle.svg"
            alt="red circle"
            width={6}
            height={6}
          />
          <span>
            {props.activeCount === undefined
              ? ""
              : `${props.activeCount}명 참여 중`}
          </span>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button onClick={props.onClickMenuBtn} className="py-[24px] px-[16px]">
        <Image src="/icon/menu.svg" alt="Menu" width={24} height={24} />
      </button>
    </div>
  );
};

const BlockedChat = (props: { chat: Chat }) => {
  const chat = props.chat;

  return (
    <>
      <Image
        width={36}
        height={36}
        src={chat.profile_image_url}
        alt={`${chat.sender_nickname} 프로필`}
        className="w-10 h-10 rounded-[12] mr-[16px]"
      />
      <div className="flex items-end">
        <div className="flex flex-col">
          {/* 닉네임 */}
          <div className="text-caption12 text-darkgray mb-[7px]">
            {chat.sender_nickname}
          </div>
          {/* 메시지 내용 */}
          <div className="flex flex-row items-center text-black text-body14 font-medium px-[12px] py-[8px] bg-lightgray rounded-[4px] break-all max-w-xs">
            <Image
              src="/icon/error_circle_black.svg"
              width={16}
              height={16}
              alt="블라인드 표시"
            />
            <span className="ml-[4px]">블라인드 처리된 내용이에요.</span>
          </div>
        </div>
      </div>
    </>
  );
};

const OthersChat = (props: {
  chat: Chat;
  onClickLightning: (chatId: string) => void;
}) => {
  const chat = props.chat;

  return (
    <>
      <Image
        width={36}
        height={36}
        src={chat.profile_image_url}
        alt={`${chat.sender_nickname} 프로필`}
        className="w-10 h-10 rounded-[12] mr-[16px]"
      />
      <div className="flex items-end">
        <div className="flex flex-col">
          {/* 닉네임 */}
          <div className="text-caption12 text-darkgray mb-[7px]">
            {chat.sender_nickname}
          </div>
          {/* 메시지 내용 */}
          <div className="text-black text-body14 font-medium px-[12px] py-[8px] bg-bgblue rounded-[4px] break-all max-w-xs">
            {chat.content}
          </div>
        </div>
        {/* 번개 버튼 */}
        <Image
          src={`/icon/${
            chat.block_type === "NONE"
              ? "active_lightning"
              : "inactive_lightning"
          }.svg`}
          className="pl-[6px] pr-[10px] pt-[10px] text-yellow-500"
          alt="lightning"
          width={36}
          height={30}
          onClick={
            chat.block_type === "NONE"
              ? () => props.onClickLightning(chat.id)
              : undefined
          }
        />
      </div>
    </>
  );
};

const MyChat = (props: { chat: Chat }) => {
  const chat = props.chat;

  return (
    <div className="flex flex-col items-end">
      {/* 메시지 내용 */}
      <div className="text-black text-body14 font-medium px-[12px] py-[8px] bg-yellow rounded-[4px] break-all max-w-xs">
        {chat.content}
      </div>
    </div>
  );
};

const LightningDialog = (props: {
  onClickConfirm: () => Promise<void>;
  onClickCancel: () => void;
}) => {
  const [isSendingLightning, setIsSendingLightning] = useState(false);

  const onClickConfirmBtn = async () => {
    setIsSendingLightning(true);
    await props.onClickConfirm();
    setIsSendingLightning(false);
  };

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full bg-black opacity-40"
        onClick={props.onClickCancel}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[343px] rounded-[10px] flex flex-col items-center justify-center px-[16px] pt-[32px] pb-[12px]">
        <h1 className="text-heading24 text-black font-bold">
          라이트닝 적용하기
        </h1>
        <Image
          src="/icon/main_image.svg"
          alt="라이트닝 당하는 해골"
          width={133}
          height={137}
          className="my-[16px]"
        ></Image>
        <div className="text-body16 text-black text-center">
          라이트닝의 건전한 문화를 망치는
          <br />
          유저의 채팅을 바로 가려보세요!
        </div>
        <button
          onClick={onClickConfirmBtn}
          className={`w-full h-[48px] mt-[11px] bg-black text-body16 text-white font-bold rounded-[10px] ${
            isSendingLightning && "opacity-50"
          }`}
          disabled={isSendingLightning}
        >
          지금 적용하기
        </button>
        <button
          onClick={props.onClickCancel}
          className="w-full h-[42px] mb-[12px] text-body14 text-darkgray"
        >
          나중에 할게요
        </button>
      </div>
    </div>
  );
};

const ClosedDialog = (props: {
  children: React.ReactNode;
  notificationCount?: number;
  onClickAlarmBtn: () => void;
}) => {
  const { children, notificationCount, onClickAlarmBtn } = props;

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full bg-black opacity-40" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[343px] h-[300px] rounded-[10px] flex flex-col items-center px-[16px] py-[24px]">
        <div className="relative text-heading20 text-black font-bold grow flex flex-col justify-center items-center">
          {children}
        </div>
        <div className="text-caption14 font-normal text-gray mb-[6px]">
          {notificationCount !== undefined &&
            `${notificationCount}명이 알림 기다리는 중`}
        </div>
        <button
          onClick={onClickAlarmBtn}
          className={`w-full h-[48px] bg-black text-body16 text-white font-bold rounded-[10px] active:bg-opacity-50`}
        >
          채팅 시작할 때 알림 받기
        </button>
      </div>
    </div>
  );
};
