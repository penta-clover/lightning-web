"use client"

import { useState, useEffect } from "react"
import clsx from "clsx"
import axios from "axios"
import { onSnapshot, doc, getFirestore } from "firebase/firestore"
import { useFirebaseApp } from "../firebase-provider"

import { Button } from "@/components/ui/button"
import { ChatroomSettings } from "./components/ChatroomSettings"
import { DummyUserManagement } from "./components/DummyUserManagement"
import { LiveChat } from "./components/LiveChat"
import { ChatControls } from "./components/ChatControls"
import { ExternalLiveChat } from "./components/ExternalLiveChat"

type Page = "chatroom" | "dummyUser" | "liveChat"

export default function Page() {
  const app = useFirebaseApp();
  const db = getFirestore(app);

  const [currentPage, setCurrentPage] = useState<Page>("chatroom");
  const [chatroom, setChatroom] = useState<{
    roomId?: string;
    status?: string;
  }>({ roomId: undefined, status: undefined });
  let messages: string[] = [];

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "policy", "main_room"), (doc) => {
      const data = doc.data();
      const roomId = data!.room_id;
      const status = data!.status;

      setChatroom({ roomId: roomId, status: status });
    });

    return unsubscribe;
  }, [db]);

  const onSendMessage = (message: string, user: string) => {
    axios.post(
      "/api/admin/chat",
      { roomId: chatroom.roomId, content: message, memberId: user },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const onUpdateMessage = (newMessages: string[]) => {
    messages = newMessages;
  }

  const loadRecommendations = async (references: string[]) => {
    const response = await axios.post(
      "/api/admin/chat/generate",
      { messages: references, count: 5 },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    console.log(response);
    return response.data;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white h-16 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto h-full px-4">
          <span className="text-white-foreground text-xl font-bold">Admin</span>
          <div className="flex h-full">
            <Button
              variant={currentPage === "chatroom" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("chatroom")}
              className={clsx("text-white-foreground h-full rounded-none hover:bg-lightgray transition-all", currentPage === "chatroom" && "bg-lightgray")}
            >
              채팅방 설정
            </Button>
            <Button
              variant={currentPage === "dummyUser" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("dummyUser")}
              className={clsx("text-white-foreground h-full rounded-none hover:bg-lightgray transition-all", currentPage === "dummyUser" && "bg-lightgray")}
            >
              더미 유저 관리
            </Button>
            <Button
              variant={currentPage === "liveChat" ? "secondary" : "ghost"}
              onClick={() => setCurrentPage("liveChat")}
              className={clsx("text-white-foreground h-full rounded-none hover:bg-lightgray transition-all", currentPage === "liveChat" && "bg-lightgray")}
            >
              실시간 채팅창
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto h-full">
        <div className="max-w-7xl mx-auto">
          {currentPage === "chatroom" && <ChatroomSettings />}
          {currentPage === "dummyUser" && <DummyUserManagement />}
          {currentPage === "liveChat" && (
            <div className="flex space-x-4">
              <LiveChat className="flex-1 min-width: 0" onSendMessage={onSendMessage} />
              <ChatControls
                className="flex-1 min-width: 0"
                onSendMessage={onSendMessage}
                getRecommendations={async () => { return await loadRecommendations(messages); }}
              />
              <ExternalLiveChat
                className="flex-1 min-width: 0"
                onSendMessage={onSendMessage}
                onUpdateMessages={onUpdateMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

