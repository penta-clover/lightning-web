import Image from "next/image";

export default function InfluencerChat(props: {
  chat: Chat;
  onClickLightning: (chatId: string) => void;
  onClickLink: () => void;
}) {
  const { chat, onClickLightning, onClickLink } = props;

  return (
    <>
      <Image
        width={36}
        height={36}
        src={chat.profile_image_url}
        alt={`${chat.sender_nickname} 프로필`}
        className="w-10 h-10 rounded-[12] mr-[16px]"
        onClick={onClickLink}
      />
      <div className="flex flex-col">
        <div className="flex items-end">
          <div className="flex flex-col">
            {/* 닉네임 */}
            <div className="flex flex-row justify-start items-center mb-[7px] ">
              <div
                className="text-caption12 text-blue font-medium"
                onClick={onClickLink}
              >
                {chat.sender_nickname}
              </div>
              <Image
                src="/icon/official_mark.svg"
                width={10}
                height={10}
                alt="official"
                className="ml-[2px]"
              />
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
                ? () => onClickLightning(chat.id)
                : undefined
            }
          />
        </div>
        <div
          className="m-[3px] text-caption12 text-darkgray"
          onClick={onClickLink}
        >
          <div>{chat.optional!.introduction_on_chat ?? ""}</div>
          <div className="underline">{chat.optional!.cta_on_chat ?? ""}</div>
        </div>
      </div>
    </>
  );
}
