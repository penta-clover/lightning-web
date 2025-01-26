'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            return;
        } else if (status === "unauthenticated") {
            router.push('/');
        } else if (session!.id) {
            // 사용자 정보가 있다면, 회원가입을 수행하지 않고 메인 페이지로 이동
            router.push('/');
        } else {
            // 사용자 정보가 없다면, 회원가입 페이지로 이동
            const params = new URLSearchParams()
            params.append("socialType", session!.socialType!);
            params.append("socialId", session!.socialId!);
            params.append("email", session!.user?.email ?? "");

            router.push(`/join/step1?${params.toString()}`);
        }
    });

    return <div>Loading...</div>;
}
