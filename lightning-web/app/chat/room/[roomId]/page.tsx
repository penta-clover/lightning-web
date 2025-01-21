'use client';

import { getSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const { roomId } = useParams();

    useEffect(() => {

        (async () => {
            const session = await getSession();
            console.log(session);
        })();
    }, []);

    return (
        <div>
            this is chat room { roomId } 
        </div>
    )
}