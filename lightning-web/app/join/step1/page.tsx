'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [nickname, setNickname] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [isNicknameUnique, setIsNicknameUnique] = useState(false);

    const handleComplete = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.append("nickname", nickname);

        router.push(`/join/step2?${newParams.toString()}`);
    }

    const censorNickname = (value: string) => {
        if (value.length > 8) return false;
        if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/.test(value)) return false;
    
        return true;
    }

    const validateNickname = (value: string) => {
        if (value.length < 1) return false;
        if (value.length > 8) return false;
        if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/.test(value)) return false;
    
        return true;
    }

    const checkNicknameUnique = async (nickname: string) => {
        const response = await fetch(`/api/member/nickname/${nickname}`);
        if (response.status == 200) {
            setIsNicknameUnique(false);
        } else {
            setIsNicknameUnique(true);
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsNicknameUnique(false);
        const value = e.target.value;

        if (censorNickname(value)) {
            setIsNicknameValid(validateNickname(value));
            setNickname(value);
        } else {
            setIsNicknameValid(validateNickname(nickname));
        }
    }

    return (
        <div>
            <label htmlFor="nickname" className="mr-2 text-lg">닉네임</label>
            <div className="flex items-center space-x-2">
                <input 
                    type="text" 
                    id="nickname" 
                    value={nickname}
                    onInput={handleInput}
                    placeholder="닉네임을 입력하세요"
                    className="flex-1 px-4 py-2 text-base border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="button"
                    onClick={() => { checkNicknameUnique(nickname) }}
                    className={`px-4 py-2 text-white text-base font-medium rounded-md 
                        ${isNicknameValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                    disabled={!isNicknameValid}
                >
                    중복 확인
                </button>
            </div>

            <button
                type="button"
                className={`px-4 py-2 text-white text-base font-medium rounded-md 
                    ${isNicknameValid && isNicknameUnique ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!(isNicknameValid && isNicknameUnique)}
                onClick={handleComplete}
            >
                다음
            </button>
        </div>
    );

}