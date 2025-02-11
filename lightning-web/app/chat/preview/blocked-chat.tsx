import Image from "next/image";

export default function BlockedChat(props: { chat: Chat }) {
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
          <div className="flex flex-row items-center text-black text-body14 font-medium px-[12px] py-[8px] bg-lightgray rounded-[4px] break-all max-w-xs">
            <Image
              src="/icon/error_circle_black.svg"
              width={16}
              height={16}
              alt="블라인드 표시"
            />
            <span className="ml-[4px]">블라인드 처리된 내용이에요.</span>
          </div>
        </div>
      </div>
    </>
  );
};