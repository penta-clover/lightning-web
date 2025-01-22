"use client";

import { SessionProvider } from "next-auth/react";
import { FirebaseAppProvider } from "./firebase-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <FirebaseAppProvider>{children}</FirebaseAppProvider>
    </SessionProvider>
  );
}
