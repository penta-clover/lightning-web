import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { AdminConfig } from "@/external/firebase/AdminConfig";
import { getFirestore } from "firebase-admin/firestore";

export const app = initializeApp({
    credential: cert(AdminConfig as ServiceAccount)
});

export const db = getFirestore(app);