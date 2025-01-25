import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExternalChatMessage = {
  id: number;
  user: string;
  message: string;
};

type ExternalLiveChatProps = {
  className?: string;
  onSendMessage?: (message: string, user: string) => void;
  onUpdateMessages?: (messages: string[]) => void;
};

export function ExternalLiveChat({
  className,
  onUpdateMessages,
}: ExternalLiveChatProps) {
  const [apiKeys, setApiKeys] = useState<[{name:string, value:string}]>();
  const [apiKey, setApiKey] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [liveChatId, setLiveChatId] = useState();
  const [externalMessages, setExternalMessages] = useState<
    ExternalChatMessage[]
  >([]);
  const [isBottom, setIsBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/admin/key/youtube");

      if (res.status !== 200) {
        alert("api key를 불러오는데 실패했습니다.");
      }

      setApiKeys(res.data);
    })();
  }, []);


  useEffect(() => {
    const interval = setInterval(async () => {
      if (!liveChatId || !apiKey) {
        return;
      }

      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet&key=${apiKey}`
      );

      interface YoutubeLiveChatSnippet {
        authorChannelId: string;
        displayMessage: string;
      }

      interface YoutubeLiveChatItem {
        id: string;
        snippet: YoutubeLiveChatSnippet;
      }

      const messages = res.data.items.map((item: YoutubeLiveChatItem) => ({
        id: item.id,
        user: item.snippet.authorChannelId,
        message: item.snippet.displayMessage,
      }));

      setExternalMessages((prevMessages) => {
        interface FilteredExternalChatMessage {
          id: number;
          user: string;
          message: string;
        }

        const newMessages: FilteredExternalChatMessage[] = messages.filter(
          (msg: FilteredExternalChatMessage) =>
            !prevMessages.find((prevMsg: FilteredExternalChatMessage) => prevMsg.id === msg.id)
        );
        const result = [...prevMessages, ...newMessages];
        onUpdateMessages?.(result.slice(-10).map((msg) => msg.message));
        return result;
      });
    }, 2000); // 2초마다 호출

    return () => clearInterval(interval); // 컴포넌트가 언마운트되면 인터벌 제거
  }, [apiKey, liveChatId, onUpdateMessages]);

  useEffect(() => {
    if (!url || !apiKey) {
      return;
    }

    let videoId;

    try {
      videoId = getQueryVariable(url, "v");
    } catch (error) {
      console.log(error);
    }

    if (!videoId) {
      return;
    }

    (async () => {
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`
      );
      const liveChatId =
        res.data.items[0].liveStreamingDetails.activeLiveChatId;
      setLiveChatId(liveChatId);
    })();
  }, [apiKey, url]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (isBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [externalMessages, isBottom]); // elements 변경 시 동작

  useEffect(() => {
    const container = containerRef?.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      const isBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
      setIsBottom(isBottom);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  });

  const getQueryVariable = (url: string, variable: string) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get(variable);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className={className}>
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-xl">유튜브 채팅</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-2">
        <div className="flex space-x-2 h-[2rem]">
          <Select onValueChange={(value: string) => setApiKey(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="api key 선택" />
            </SelectTrigger>
            <SelectContent>
              {(apiKeys ?? []).map((apiKey, index) => (
                <SelectItem key={index} value={apiKey.value}>
                  {`${apiKey.name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2 h-[2rem]">
          <Input
            // value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="유튜브 라이브 URL 입력"
            className="flex-grow"
          />
        </div>
        <div
          ref={containerRef}
          className="h-[calc(100vh-18rem)] flex-col-reverse overflow-y-auto border p-2 scroll-smooth"
        >
          {externalMessages.map((msg) => (
            <div key={msg.id} className="mb-2 flex justify-between">
              <div className="flex flex-col space-x-2">
                <span className="text-xs text-stone-500 break-all">
                  {msg.user}
                </span>
                <span className="text-sm break-all">{msg.message}</span>
              </div>
              <div className="space-x-2">
                <Button size="sm" onClick={() => copyToClipboard(msg.message)}>
                  복사
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
