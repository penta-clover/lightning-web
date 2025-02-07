"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import axios from "axios";
import clsx from "clsx";
import AutoResizeTextarea from "@/components/ui/auto-resize-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChatControlsProps = {
  onSendMessage?: (message: string, user: string) => void;
  className?: string;
  getRecommendations?: () => Promise<string[]>;
};

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
  phoneNumber: string | null;
  favoriteTeam: string | null;
};

export function ChatControls({
  onSendMessage,
  getRecommendations,
  className,
}: ChatControlsProps) {
  const [shortcuts, setShortcuts] = useState<{content: string, team: string | null}[]>([
    { content: "대 상 혁", team: "T1" },
    { content: "와", team: "NONE" },
    { content: "화이팅🔥🔥🔥", team: "NONE" },
    { content: "레전드", team: "NONE" },
    { content: "미쳤다ㅋㅋㅋㅋㅋ", team: "NONE" },
    { content: "아 이게 이렇게 되네..ㅠ", team: "NONE" },
    { content: "오창섭이~~", team: "T1" },
    { content: "쵸오오오오비이이이이이이이", team: "GEN" },
    { content: "71인분 가즈아", team: "GEN" },
    { content: "룰러 더 클래식 제 1악장", team: "GEN" },
  ]);
  const [newShortcut, setNewShortcut] = useState("");
  const [newShortcutTeam, setNewShortcutTeam] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [team1, setHandleChangeTeam1] = useState<string | null>(null);
  const [team2, setHandleChangeTeam2] = useState<string | null>(null);
  const [team3, setHandleChangeTeam3] = useState<string | null>(null);

  const [dummyUsers, setDummyUsers] = useState<User[]>();

  useEffect(() => {
    loadDummies((dummies) => {
      setDummyUsers(dummies);
    });
  }, []);

  const sendMessage = (message: string, favoriteTeam: string | null) => {
    if (favoriteTeam === "NONE") {
      favoriteTeam = null;
    }
    
    if (!dummyUsers) {
      alert("더미 유저를 불러오지 못했습니다.");
      return;
    }

    const dummyForTeam = dummyUsers.filter(
      (dummy) => dummy.favoriteTeam === favoriteTeam
    );

    if (dummyForTeam.length === 0) {
      alert("해당 팀의 더미 유저가 없습니다.");
      return;
    }

    const selectedDummy =
      dummyForTeam[Math.floor(Math.random() * dummyForTeam.length)];

    if (message.trim() && onSendMessage) {
      onSendMessage(message, selectedDummy.id);
    }
  };

  const addShortcut = () => {
    if (newShortcut.trim()) {
      setShortcuts([...shortcuts, { content: newShortcut, team: newShortcutTeam }]);
      setNewShortcut("");
    }
  };

  const removeShortcut = (shortcut: string) => {
    setShortcuts(shortcuts.filter((s) => s.content !== shortcut));
  };

  const loadRecommendations = async () => {
    if (!getRecommendations) {
      alert("추천 채팅을 생성할 수 없습니다.");
      return;
    }

    setIsGenerating(true);
    const recommendations = await getRecommendations();
    setIsGenerating(false);
    setRecommendations([...recommendations]);
  };

  useEffect(() => {
    console.log("Recommendations updated:", recommendations);
  }, [recommendations]);

  return (
    <Card className={className}>
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-xl">컨트롤 패널</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-2">
        <div className="space-y-1">
          <h3 className="font-semibold">채팅</h3>
          <div className="flex flex-row space-x-1">
            <div className="w-[90px]">
              <Select onValueChange={setHandleChangeTeam1} defaultValue="NONE">
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
            <Inputter
              placeholder="메시지 입력"
              onSend={(input) => sendMessage(input, team1)}
            />
          </div>
          <div className="flex flex-row space-x-1">
            <div className="w-[90px]">
              <Select onValueChange={setHandleChangeTeam2} defaultValue="NONE">
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
            <Inputter
              placeholder="메시지 입력"
              onSend={(input) => sendMessage(input, team2)}
            />
          </div>
          <div className="flex flex-row space-x-1">
            <div className="w-[90px]">
              <Select onValueChange={setHandleChangeTeam3} defaultValue="NONE">
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
            <Inputter
              placeholder="메시지 입력"
              onSend={(input) => sendMessage(input, team3)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">추천 채팅</h3>
          <div className="flex space-x-2 items-center w-full">
            <Button
              disabled={isGenerating}
              onClick={loadRecommendations}
              variant="outline"
              className={clsx("whitespace-nowrap w-full transition-all", {
                "shadow-lg": isGenerating,
              })}
            >
              {isGenerating ? "생성 중..." : "추천 채팅 생성"}
            </Button>
            {/* <span className={clsx('text-xs text-gray-500', {'hidden':!isGenerating})}>생성 중...</span> */}
          </div>
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex space-x-2">
              <AutoResizeTextarea
                value={recommendation}
                onChange={(e) =>
                  setRecommendations([
                    ...recommendations.slice(0, index),
                    e.target.value,
                    ...recommendations.slice(index + 1),
                  ])
                }
                className="flex-grow break-all h-8 resize-none"
              />
              <Button
                onClick={() => {
                  sendMessage(recommendation, null);
                }}
                className="whitespace-nowrap"
              >
                전송
              </Button>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">단축어</h3>
          <div className="flex space-x-1">
            <div className="w-[90px]">
              <Select onValueChange={setNewShortcutTeam} defaultValue="NONE">
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
            <Input
              value={newShortcut}
              onChange={(e) => setNewShortcut(e.target.value)}
              placeholder="새 단축어 입력"
              className="grow"
            />
            <Button onClick={addShortcut} className="whitespace-nowrap">
              추가
            </Button>
          </div>
          <div className="space-y-0">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between shadow-sm bg-secondary rounded border-black"
              >
                <Button
                  className="shadow-sm"
                  size="sm"
                  onClick={() => {
                    sendMessage(shortcut.content, shortcut.team);
                  }}
                >
                  전송
                </Button>
                <span className="w-full px-2 break-all">{shortcut.content}</span>
                <span className="w-[80px] px-2 break-all">{shortcut.team}</span>
                <div className="flex space-x-2 items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeShortcut(shortcut.content)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Inputter(props: {
  placeholder: string;
  defaultValue?: string;
  onSend: (input: string) => void;
}) {
  const [inputMessage, setInputMessage] = useState(props.defaultValue ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      props.onSend(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div className="flex w-full space-x-2">
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder}
        className="flex-grow"
      />
      <Button
        onClick={() => {
          props.onSend(inputMessage);
          setInputMessage("");
        }}
        className="whitespace-nowrap"
      >
        전송
      </Button>
    </div>
  );
}

function loadDummies(callback: (dummies: User[]) => void) {
  axios.get("/api/admin/member/dummy/status/active").then((res) => {
    const dummies: User[] = [];

    res.data.forEach((user: User) => {
      dummies.push(user);
    });

    callback(dummies);
  });
}
