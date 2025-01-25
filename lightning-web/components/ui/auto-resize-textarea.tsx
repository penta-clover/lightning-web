import React, { useRef, useEffect } from "react";
import { Textarea } from "./textarea";

const AutoResizeTextarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 값이 JS로 변경될 때 감지하기 위해 MutationObserver를 사용
    const observer = new MutationObserver(adjustHeight);
    observer.observe(textarea, {
      attributes: true, // 속성 변화를 감지
      attributeFilter: ["value"], // `value` 속성의 변화만 감지
    });

    // 초기 크기 조정
    adjustHeight();

    return () => {
      observer.disconnect(); // 컴포넌트가 언마운트될 때 옵저버 해제
    };
  }, []);

  useEffect(() => {
    // props.value가 변경될 때도 크기 조정
    adjustHeight();
  }, [props.value]);

  return (
    <Textarea
      ref={textareaRef}
      {...props} // 외부 props 추가
      style={{ ...(props.style || {}), resize: "none", overflow: "hidden" }} // 외부 스타일 병합
    />
  );
};

export default AutoResizeTextarea;
