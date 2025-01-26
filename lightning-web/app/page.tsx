'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect (() => {
    if (status === 'authenticated' && session.id) {
      // 사용자 정보가 있다면, 메인 페이지로 이동
    router.replace("/chat/room/main");
    }
  }, [status, session]);

  if (status === "authenticated" && session.id) {
    // 로그인되어 있다면, 세션에 사용자 정보가 들어있습니다

    const user = session.user;
    return (
      <div>
        <h1>Welcome, {user?.name}!</h1>
        <p>Email: {user?.email}</p>
      </div>
    );
  } else if (status === 'loading') {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <p>unauthenticated...</p>
        { status === 'authenticated' && <p>session: {JSON.stringify(session)}</p> }
        <div>
          <button onClick={() => { signIn('google', { redirect: false }) }}>
            Sign in with Google
          </button>
        </div>
        <div>
          <button onClick={() => { signIn('kakao', { redirect: false }) }}>
            Sign in with Kakao
          </button>
        </div>
      </div>
    );
  }
}
