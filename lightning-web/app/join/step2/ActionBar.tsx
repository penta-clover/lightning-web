import Image from "next/image";

export default function ActionBar(props: {
  onClickBack: () => void;
  onClickClose: () => void;
}) {
  const { onClickBack, onClickClose } = props;

  return (
    <div className="flex items-center justify-between w-full h-[72px] bg-white">
      {/* 뒤로가기 버튼 */}
      <Image
        src="/icon/arrow_back.svg"
        alt="Back"
        width={56}
        height={72}
        onClick={onClickBack}
        className="px-[16px] py-[24px]"
      />

      {/* 제목 */}
      <h1 className="text-lg font-semibold"></h1>

      {/* 닫기 버튼 */}
      <Image
        src="/icon/close.svg"
        alt="Close"
        width={56}
        height={72}
        onClick={onClickClose}
        className="px-[16px] py-[24px]"
      />
    </div>
  );
}
