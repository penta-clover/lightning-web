
export default function MyChat(props: { chat: Chat }) {
  const chat = props.chat;

  return (
    <div className="flex flex-col items-end">
      {/* 메시지 내용 */}
      <div className="text-black text-body14 font-medium px-[12px] py-[8px] bg-yellow rounded-[4px] break-all max-w-xs">
        {chat.content}
      </div>
    </div>
  );
};
