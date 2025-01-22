"use client";

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
} from "firebase/firestore";
import axios from "axios";

export default function Page() {
  const app = useFirebaseApp();
  const db = getFirestore(app);

  const [chatRoom, setChatRoom] = useState<{
    roomId: string;
    status: string;
  }>();
  const [chats, setChats] = useState<object[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const sendChatMessage = async () => {
    if (!chatRoom) {
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
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats: object[] = [];
      querySnapshot.forEach((doc) => {
        chats.push(doc.data());
      });
      setChats(chats);
    });

    return unsubscribe;
  }, [db, chatRoom]);

  return (
    <div>
      <div>{JSON.stringify(chatRoom)}</div>
      <div>{JSON.stringify(chats)}</div>
      <div className="flex items-center w-full p-4 border-t border-gray-300">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendChatMessage}
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          전송
        </button>
      </div>
    </div>
  );
}
