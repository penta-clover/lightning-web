import Image from "next/image";

export default function OthersChat(props: {
  chat: Chat;
  onClickLightning: (chatId: string) => void;
}) {
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
          <div className="text-black text-body14 font-medium px-[12px] py-[8px] bg-bgblue rounded-[4px] break-all max-w-xs">
            {chat.content}
          </div>
        </div>
        {/* 번개 버튼 */}
        <Image
          src={`/icon/${
            chat.block_type === "NONE"
              ? "active_lightning"
              : "inactive_lightning"
          }.svg`}
          className="pl-[6px] pr-[10px] pt-[10px] text-yellow-500"
          alt="lightning"
          width={36}
          height={30}
          onClick={
            chat.block_type === "NONE"
              ? () => props.onClickLightning(chat.id)
              : undefined
          }
        />
      </div>
    </>
  );
};