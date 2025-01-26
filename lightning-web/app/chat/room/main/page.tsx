"use client";

import Image from "next/image";
import { useFirebaseApp } from "@/app/firebase-provider";
import { useState, useEffect } from "react";
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

  const [chatRoom, setChatRoom] = useState<{
    roomId: string;
    status: string;
  }>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [lightnings, setLightnings] = useState<Lightning[]>([]);

  const sendChatMessage = async () => {
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
    } else {
      console.error("Failed to send chat message");
    }
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
        chat.profile_image_url = "/profile/lightned.png";
      } else {
        chat.transparency = 0;
      }
    }

    return newChats;
  };

  const handleLightning = async (chatId: string) => {
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
      alert("지지직...");
    } else {
      console.error("Failed to send lightning");
    }

    setLightnings([...lightnings, response.data]);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    // 높이를 자동으로 조정
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + "px"; // 최대 높이 96px (4줄)
    setInputMessage(textarea.value);
  };

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, chatRoom, lightnings]);

  useEffect(() => {
    setChats(applyTransparency(chats));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightnings]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    axios
      .post(
        "/api/chat/lightning/my",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLightnings(response.data.lightnings);
        applyTransparency(chats);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  return (
    <div className="flex flex-col h-screen">
      {/* 채팅 메시지 컨테이너 */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 flex flex-col-reverse">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="flex items-start mb-4"
            style={{ opacity: (100 - chat.transparency) / 100 }}
          >
            {/* 프로필 이미지 */}
            <Image
              width={40}
              height={40}
              src={chat.profile_image_url}
              alt={`${chat.sender_nickname} 프로필`}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex items-end">
              <div className="flex flex-col">
                {/* 닉네임 */}
                <div className="text-xs font-semibold text-gray-800">
                  {chat.sender_nickname}
                </div>
                {/* 메시지 내용 */}
                <div className="text-gray-800 p-2 bg-white rounded shadow break-words max-w-xs">
                  {chat.content}
                </div>
              </div>
              {/* 번개 버튼 */}
              <button
                className="p-2 text-yellow-500"
                onClick={() => handleLightning(chat.id)}
              >
                ⚡
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* 메시지 입력창 */}
      <div className="flex items-center border-t p-4 bg-white">
        <textarea
          value={inputMessage}
          onChange={handleInput}
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2 border rounded resize-none overflow-hidden max-h-[6rem] h-auto"
          rows={1}
          style={{
            lineHeight: "1.5rem",
          }}
        />
        <button
          onClick={sendChatMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}
