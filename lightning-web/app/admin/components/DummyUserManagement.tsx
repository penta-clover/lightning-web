import React, { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  favoriteTeam: string | null;
  phoneNumber: string | null;
};

/** 개별 더미 유저 항목 컴포넌트 (메모이제이션 적용) */
const DummyUserItem = React.memo(
  ({
    user,
    onToggleUserStatus,
    onChangeFavoriteTeam,
  }: {
    user: User;
    onToggleUserStatus: (id: string) => void;
    onChangeFavoriteTeam: (id: string, team: string | null) => void;
  }) => {
    return (
      <div className="flex items-center justify-between px-2 py-1 bg-secondary border rounded-lg shadow-sm hover:bg-bggray hover:shadow-md transition-shadow duration-200">
        <div className="w-[100px]">
          <Select
            onValueChange={(value) => onChangeFavoriteTeam(user.id, value)}
            defaultValue={user.favoriteTeam ?? "NONE"}
          >
            <SelectTrigger className="flex-grow">
              <SelectValue placeholder="없음" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">없음</SelectItem>
              <SelectItem value="GEN">GEN</SelectItem>
              <SelectItem value="HLE">HLE</SelectItem>
              <SelectItem value="T1">T1</SelectItem>
              <SelectItem value="DK">DK</SelectItem>
              <SelectItem value="KT">KT</SelectItem>
              <SelectItem value="BRO">BRO</SelectItem>
              <SelectItem value="DRX">DRX</SelectItem>
              <SelectItem value="DNF">DNF</SelectItem>
              <SelectItem value="NS">NS</SelectItem>
              <SelectItem value="BFX">BFX</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span>{user.nickname}</span>
        <Switch
          checked={user.role === "DUMMY"}
          onCheckedChange={() => onToggleUserStatus(user.id)}
        />
      </div>
    );
  }
);

/** 더미 유저 리스트 컴포넌트 (메모이제이션 적용) */
const DummyUserList = React.memo(
  ({
    dummyUsers,
    onToggleUserStatus,
    onChangeFavoriteTeam,
  }: {
    dummyUsers: User[];
    onToggleUserStatus: (id: string) => void;
    onChangeFavoriteTeam: (id: string, team: string | null) => void;
  }) => {
    return (
      <div>
        <h3 className="text-lg font-semibold">더미 유저 리스트</h3>
        <div className="space-y-1">
          {dummyUsers.map((user) => (
            <DummyUserItem
              key={user.id}
              user={user}
              onToggleUserStatus={onToggleUserStatus}
              onChangeFavoriteTeam={onChangeFavoriteTeam}
            />
          ))}
        </div>
      </div>
    );
  }
);

export function DummyUserManagement() {
  const [dummyUsers, setDummyUsers] = useState<User[]>([]);
  const [newNickname, setNewNickname] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(true);

  const createDummyUser = async () => {
    await axios.post(
      "/api/admin/member",
      {
        nickname: newNickname,
        socialType: "LOCAL",
        socialId: uuidv4(),
        email: "dummy@a.com",
        profileImageUrl: "/profile/default.svg",
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

  // dummyUsers가 변경되지 않는 한 동일한 함수 참조를 유지하도록 useCallback 사용
  const handleChangeFavoriteTeam = useCallback(
    (userId: string, favoriteTeam: string | null) => {
      if (favoriteTeam === "NONE") {
        favoriteTeam = null;
      }

      const dummy = dummyUsers.find((user) => user.id === userId);

      if (!dummy) {
        alert("더미 정보를 찾을 수 없습니다.");
        return;
      }

      dummy.favoriteTeam = favoriteTeam;

      axios
        .put(
          "/api/admin/member/dummy",
          {
            memberId: userId,
            data: dummy,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          setIsDirty(true);
        });
    },
    [dummyUsers]
  );

  const toggleUserStatus = useCallback(
    (id: string) => {
      const user: User | undefined = dummyUsers.find((user) => user.id === id);

      if (!user) {
        return;
      }

      axios
        .post(
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
        )
        .then(() => {
          setIsDirty(true);
        });
    },
    [dummyUsers]
  );

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    axios.get("/api/admin/member/dummy").then((res) => {
      const dummies: User[] = [];
      console.log(`res.data: ${JSON.stringify(res.data)}`);
      res.data.forEach((user: User) => {
        dummies.push(user);
      });
      setDummyUsers(dummies);
      setIsDirty(false); // 데이터 로딩 후 isDirty를 false로 전환
    });
  }, [isDirty]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>더미 유저 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 입력 폼 */}
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

        {/* 더미 유저 리스트 (별도 컴포넌트로 분리) */}
        <DummyUserList
          dummyUsers={dummyUsers}
          onToggleUserStatus={toggleUserStatus}
          onChangeFavoriteTeam={handleChangeFavoriteTeam}
        />
      </CardContent>
    </Card>
  );
}
