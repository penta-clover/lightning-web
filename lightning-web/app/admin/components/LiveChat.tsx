"use client";

import { useEffect, useState, useRef } from "react";

import { useFirebaseApp } from "@/app/firebase-provider";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import axios from "axios";

type Chat = {
  id: string;
  sender_id: string;
  sender_nickname: string;
  profile_image_url: string;
  content: string;
  created_at: string;
  transparency: number;
  block_type: string;
  chat_type: string | undefined;
  optional: object | undefined;
};

type LiveChatProps = {
  className?: string;
  onSendMessage?: (message: string, user: string) => void;
};

export function LiveChat({ className }: LiveChatProps) {
  const app = useFirebaseApp();
  const db = getFirestore(app);

  const [chatRoom, setChatRoom] = useState<{
    roomId: string;
    status: string;
  }>();
  const [chats, setChats] = useState<Chat[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBottom, setIsBottom] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, process.env.NEXT_PUBLIC_FIRESTORE_POLICY_COLLECTION as string, "main_room"), (doc) => {
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
      setChats(newChats);
    });

    return unsubscribe;
  }, [db, chatRoom]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (isBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chats, isBottom]); // elements 변경 시 동작

  useEffect(() => {
    const container = containerRef?.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      const isBottom =
        -container.scrollTop + container.clientHeight >=
        container.scrollHeight - 10;
      setIsBottom(isBottom);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  });

  const handleMemberBlind = async (memberId: string, blockLevel: string) => {
    const res = await axios.post("/api/admin/member/blind", {
      memberId: memberId,
      blockLevel: blockLevel,
    });

    if (res.status === 200) {
      alert("반영 완료되었습니다.");
    } else {
      alert("블라인드 처리에 실패했습니다.");
    }
  };

  const handleChatBlind = async (chatId: string, blockType: string) => {
    const res = await axios.post("/api/admin/chat/blind", {
      chatId: chatId,
      blockType: blockType,
    });

    if (res.status === 200) {
      alert("반영 완료되었습니다.");
    } else {
      alert("블라인드 처리에 실패했습니다.");
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-xl">실시간 채팅</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div
          ref={containerRef}
          className="h-[calc(100vh-10rem)] overflow-y-auto flex flex-col-reverse border p-2 scroll-smooth"
        >
          {chats.map((msg) => (
            <div key={msg.id} className="flex flex-col items-start mb-2 shadow-md p-2 rounded">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="px-2 py-0 h-4 text-gray-500 text-xs"
                  >
                    {msg.sender_nickname}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>🤐 사용자 블라인드</DialogTitle>
                    <DialogDescription className="break-words">
                      사용자 ({msg.sender_nickname}, {msg.sender_id})의
                      블라인드 수준을 선택해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <div className="flex justify-end space-x-2 ">
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleMemberBlind(msg.sender_id, "NONE")}>NONE</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleMemberBlind(msg.sender_id, "TRANSPARENT")}>TRANSPARENT</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleMemberBlind(msg.sender_id, "BLOCKED")}>BLOCKED</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleMemberBlind(msg.sender_id, "INVISIBLE")}>INVISIBLE</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleMemberBlind(msg.sender_id, "DISABLED")}>DISABLED</Button>
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="link"
                    className="px-2 py-0 text-sm break-all max-w-[25vw]"
                  >
                    {msg.content}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>⛔️ 채팅 블라인드</DialogTitle>
                    <DialogDescription className="break-words">
                      채팅 ({msg.content}, {msg.id})의
                      블라인드 수준을 선택해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogClose asChild>
                    <div className="flex justify-end space-x-2 ">
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleChatBlind(msg.id, "NONE")}>NONE</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleChatBlind(msg.id, "TRANSPARENT")}>TRANSPARENT</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleChatBlind(msg.id, "BLOCKED")}>BLOCKED</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleChatBlind(msg.id, "INVISIBLE")}>INVISIBLE</Button>
                      <Button className="bg-bggray hover:bg-lightgray active:bg-darkgray px-[8px]" onClick={() => handleChatBlind(msg.id, "DISABLED")}>DISABLED</Button>
                    </div>
                  </DialogClose>
                </DialogContent>
              </Dialog>
              <span className="px-2 py-0 text-xs text-darkgray">{msg.block_type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
