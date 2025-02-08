export default function ClosedDialog(props: {
  children: React.ReactNode;
  notificationCount?: number;
  onClickAlarmBtn: () => void;
}) {
  const { children, notificationCount, onClickAlarmBtn } = props;

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-full bg-black opacity-40" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[343px] h-[300px] rounded-[10px] flex flex-col items-center px-[16px] py-[24px]">
        <div className="relative text-heading20 text-black font-bold grow flex flex-col justify-center items-center">
          {children}
        </div>
        <div className="text-caption14 font-normal text-gray mb-[6px]">
          {notificationCount !== undefined &&
            `${notificationCount}명이 알림 기다리는 중`}
        </div>
        <button
          onClick={onClickAlarmBtn}
          className={`w-full h-[48px] bg-black text-body16 text-white font-bold rounded-[10px] active:bg-opacity-50`}
        >
          채팅 열리면 바로 알려드려요!
        </button>
      </div>
    </div>
  );
}
