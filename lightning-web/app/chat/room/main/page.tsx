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
  const [canInput, setCanInput] = useState(true);
  const [chatToLightning, setChatToLightning] = useState<string>();
  const [notificationCount, setNotificationCount] = useState<
    number | undefined
  >();

  const sendChatMessage = async () => {
    setCanSending(false);
    setCanInput(false);

    if (!chatRoom || !inputMessage || inputMessage.trim() === "") {
      return;
    }

    // send chat message
    const response = await axios.post(
      `/api/chat/`,
      {
        content: inputMessage,
        roomId: chatRoom.roomId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      setInputMessage("");
      setCanSending(false);
    } else {
      console.error("Failed to send chat message");
      setCanSending(true);
    }

    setCanInput(true);
  };

  function applyTransparency(chats: Chat[]) {
    // console.log(`lightnings: ${lightnings}`);
    const lightnedMembers = new Set(
      lightnings.map((lightning) => lightning.receiverId)
    );
    const newChats = [...chats];

    for (const chat of newChats) {
      if (lightnedMembers.has(chat.sender_id)) {
        chat.transparency = 85;
        chat.profile_image_url = "/profile/lightned.svg";
      } else {
        chat.transparency = 0;
      }
    }

    return newChats;
  }

  const onClickLightning = async (chatId: string) => {
    setChatToLightning(chatId);
  };

  const onConfirmLightning = async () => {
    const chatId = chatToLightning;

    const response = await axios.post(
      `/api/chat/${chatId}/lightning`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Success to send lightning");
    } else {
      console.error("Failed to send lightning");
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
      setCanSending(true);
    }

    // 높이를 자동으로 조정
    textarea.style.height = "auto";
    textarea.style.height =
      Math.min(Math.max(textarea.scrollHeight, 42), 96) + "px"; // 최대 높이 96px (4줄)
    setInputMessage(textarea.value);
  };

  useEffect(() => {
    axios.get("/api/notification/click").then((res) => {
      if (res.status !== 200) {
        console.error("Failed to get notification count");
      }

      setNotificationCount(res.data.content.count);
    });
  }, []);

  useEffect(() => {
    if (session?.id === undefined) {
      router.push("/");
    } else {
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
        newChats.push({ ...doc.data(), id: doc.id, transparency: 0 } as Chat);
      });
      setChats(applyTransparency(newChats));
    });

    return unsubscribe;
  }, [db, chatRoom, lightnings]);

  useEffect(() => {
    setChats(applyTransparency(chats));
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
            router.push("http://pf.kakao.com/_VxjiTn/friend");
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
            router.push("http://pf.kakao.com/_VxjiTn/friend");
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
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`flex mb-4 w-full ${
                chat.sender_id === session?.id ? "justify-end" : "justify-start"
              }`}
              style={{ opacity: (100 - chat.transparency) / 100 }}
            >
              {chat.sender_id === session?.id ? (
                <MyChat chat={chat} />
              ) : (
                <OthersChat chat={chat} onClickLightning={onClickLightning} />
              )}
            </div>
          ))}
        </div>
        {/* 메시지 입력창 */}
        <div className="sticky w-full bottom-0 flex items-end px-[16px] py-[12px] bg-bggray">
          <textarea
            value={inputMessage}
            onChange={handleInput}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 border-[1px] border-lightgray text-body16 rounded resize-none overflow-hidden min-h-[42px] max-h-[6rem] h-auto focus:border-[1px] focus:border-lightgray"
            rows={1}
            maxLength={280}
            disabled={!canInput}
            style={{
              lineHeight: "1.5rem",
            }}
          />
          <button
            onClick={sendChatMessage}
            className={clsx(
              "flex ml-[8px] justify-center items-center w-[42px] h-[42px] text-white rounded hover:bg-blue-600",
              canSending ? "bg-black" : "bg-lightgray"
            )}
            disabled={!canSending}
          >
            <Image
              src="/icon/upload.svg"
              alt="upload"
              width={17}
              height={17}
            ></Image>
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
      {/* 빈 공간 */}
      <span className="py-[24px] px-[16px] w-[24px] h-[24px]" />

      {/* 제목 */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-body16 font-bold">{props.title}</h1>
        <span className="text-body14">
          {props.activeCount === undefined
            ? ""
            : `${props.activeCount}명 참여 중`}
        </span>
      </div>

      {/* 닫기 버튼 */}
      <button onClick={props.onClickMenuBtn} className="py-[24px] px-[16px]">
        <Image src="/icon/menu.svg" alt="Menu" width={24} height={24} />
      </button>
    </div>
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
          <div className="text-black text-body14 font-medium px-[12px] py-[8px] bg-bgblue rounded-[4px] break-words max-w-xs">
            {chat.content}
          </div>
        </div>
        {/* 번개 버튼 */}
        <button
          className="p-2 text-yellow-500"
          onClick={() => props.onClickLightning(chat.id)}
        >
          ⚡
        </button>
      </div>
    </>
  );
};

const MyChat = (props: { chat: Chat }) => {
  const chat = props.chat;

  return (
    <div className="flex flex-col items-end">
      {/* 메시지 내용 */}
      <div className="text-black text-body14 font-medium px-[12px] py-[8px] bg-yellow rounded-[4px] break-words max-w-xs">
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
          src="/icon/lightned_skeleton.svg"
          alt="라이트닝 당하는 해골"
          width={133}
          height={137}
          className="my-[16px]"
        ></Image>
        <div className="text-body16 text-black text-center">
          라이트닝을 적용하면
          <br />이 유저의 채팅을 가릴 수 있어요
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
  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full bg-black opacity-40" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[343px] h-[340px] rounded-[10px] flex flex-col items-center px-[16px] py-[24px]">
        <div className="text-heading20 text-black font-bold grow flex flex-col justify-center items-center">
          {props.children}
        </div>
        <div className="text-body14 mt-[11px] mb-[5px]">
          {props.notificationCount !== undefined &&
            `${props.notificationCount}명이 함께 기다리는 중이에요`}
        </div>
        <button
          onClick={props.onClickAlarmBtn}
          className={`w-full h-[48px] bg-black text-body16 text-white font-bold rounded-[10px] active:bg-opacity-50`}
        >
          채팅 시작할 때 알림 받기
        </button>
      </div>
    </div>
  );
};
