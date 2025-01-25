import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

type User = {
  id: string;
  nickname: string;
  socialType: string;
  socialId: string;
  email: string;
  profileImageUrl: string;
  createdAt: string;
  alarmAllowed: boolean;
  role: string;
};

export function DummyUserManagement() {
  const [dummyUsers, setDummyUsers] = useState<User[]>([]);
  const [newNickname, setNewNickname] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const createDummyUser = () => {
    axios.post(
      "/api/admin/member",
      {
        nickname: newNickname,
        socialType: "LOCAL",
        socialId: "dummy",
        email: "dummy@a.com",
        profileImageUrl: "/profile/default.png",
        alarmAllowed: false,
        role: "DUMMY",
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setNewNickname("");
    setIsDirty(true);
  };

  useEffect(() => {
    axios.get("/api/admin/member/dummy").then((res) => {
      const dummies: User[] = [];
      console.log(`res.data: ${JSON.stringify(res.data)}`);
      res.data.forEach((user: User) => {
        dummies.push(user);
      });
      setDummyUsers(dummies);
      return res;
    });

    setIsDirty(false);
  }, [isDirty]);

  const toggleUserStatus = (id: string) => {
    const user: User | undefined = dummyUsers.find((user) => user.id === id);

    if (!user) {
      return;
    }

    axios.post(
      "/api/admin/member/dummy/status",
      {
        memberId: id,
        role: user.role === "DUMMY" ? "DISABLED_DUMMY" : "DUMMY",
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => {
      setIsDirty(true);
    });

  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>더미 유저 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="닉네임"
            className="flex-grow"
          />
          <Button onClick={createDummyUser} className="whitespace-nowrap">
            생성
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">더미 유저 리스트</h3>
          <div className="space-y-2">
            {dummyUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 bg-secondary border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span>{user.nickname}</span>
                <Switch
                  checked={user.role === "DUMMY"}
                  onCheckedChange={() => toggleUserStatus(user.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
