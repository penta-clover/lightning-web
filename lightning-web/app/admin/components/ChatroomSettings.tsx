import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from "firebase/firestore";
import { useFirebaseApp } from "@/app/firebase-provider";
import axios from "axios";
import clsx from "clsx";

type ChatroomStatus = "RESERVED" | "ACTIVE" | "TERMINATED";

type Chatroom = {
  id: string;
  name: string;
  createdAt: string;
};

export function ChatroomSettings() {
  // load firebase admin object
  const app = useFirebaseApp();
  const db = getFirestore(app);

  // init status
  const [mainChatroom, setMainChatroom] = useState<{
    name?: string;
    roomId?: string;
    status?: string;
  }>({ name: undefined, roomId: undefined, status: undefined });
  const [newMainChatroomId, setNewMainChatroomId] = useState<
    string | undefined
  >(undefined);
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [newChatroomName, setNewChatroomName] = useState("");
  const [newChatroomActiveCount, setNewChatroomActiveCount] = useState(0);
  const [newStatus, setNewStatus] = useState<ChatroomStatus | undefined>(
    undefined
  );

  // load realtime data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "policy", "main_room"),
      (mainRoomDoc) => {
        const data = mainRoomDoc.data();
        const roomId = data!.room_id;
        const status = data!.status;

        const docRef = doc(db, "chatrooms", roomId);
        getDoc(docRef).then((doc) => {
          const data = doc.data();
          setMainChatroom({ name: data?.name, roomId: roomId, status: status });
        });

        setNewMainChatroomId(roomId);
      }
    );

    return unsubscribe;
  }, [db]);

  useEffect(() => {
    if (!mainChatroom.roomId) return;

    const q = query(
      collection(db, "chatrooms"),
      orderBy("created_at", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newChatrooms: Chatroom[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newChatrooms.push({
          id: doc.id,
          name: data.name,
          createdAt: data.created_at,
        } as Chatroom);
      });

      setChatrooms(newChatrooms);
    });

    return unsubscribe;
  }, [db, mainChatroom]);

  // callbacks
  const createChatroom = () => {
    axios.post(
      "/api/admin/chatroom",
      { name: newChatroomName, activeCount: newChatroomActiveCount },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setNewChatroomName("");
    setNewChatroomActiveCount(0);
  };

  const updateMainChatroomStatus = () => {
    axios.post(
      "/api/admin/policy/main-chatroom",
      {
        roomId: mainChatroom.roomId,
        status: newStatus,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const updateMainChatroomId = () => {
    axios.post(
      "/api/admin/policy/main-chatroom",
      {
        roomId: newMainChatroomId,
        status: mainChatroom.status,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  // ui
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>채팅방 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">메인 채팅방 정보</h3>
            <p>이름: {mainChatroom.name}</p>
            <p>
              {"상태: "}
              <span
                className={`rounded-full p-1 px-2 ${clsx({
                  "bg-orange-300": mainChatroom.status === "RESERVED",
                  "bg-green-300": mainChatroom.status === "ACTIVE",
                  "bg-violet-300": mainChatroom.status === "TERMINATED",
                })}`}
              >
                {mainChatroom.status}
              </span>
            </p>
            <p>채팅방 ID: {mainChatroom.roomId}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">정책 변경</h3>
            <div className="flex space-x-2">
              <Select
                onValueChange={(value: ChatroomStatus) => setNewStatus(value)}
              >
                <SelectTrigger className="flex-grow">
                  <SelectValue placeholder="메인 채팅방 정책 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RESERVED">RESERVED</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="TERMINATED">TERMINATED</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={updateMainChatroomStatus}
                className="whitespace-nowrap"
              >
                정책 변경
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">메인 채팅방 전환</h3>
            <div className="flex space-x-2">
              <Select
                onValueChange={(value: string) => setNewMainChatroomId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="메인 채팅방 선택" />
                </SelectTrigger>
                <SelectContent>
                  {chatrooms.map((chatroom) => (
                    <SelectItem key={chatroom.id} value={chatroom.id}>
                      {`${chatroom.name} (${chatroom.id})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={updateMainChatroomId}
                className="whitespace-nowrap"
              >
                전환
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>새 채팅방 생성</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={newChatroomName}
              onChange={(e) => setNewChatroomName(e.target.value)}
              placeholder="새 채팅방 이름"
              className="grow"
            />
            <Input
              type="number"
              value={newChatroomActiveCount}
              onChange={(e) => setNewChatroomActiveCount(parseInt(e.target.value))}
              placeholder="새 채팅방 초기 참여자 수"
              className="grow"
            />
            <Button onClick={createChatroom} className="whitespace-nowrap">
              생성
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
