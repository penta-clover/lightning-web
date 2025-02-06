import { SocialType } from '@/repository/dto/SocialType';

export type JoinForm = {
    nickname: string;
    socialType: SocialType;
    socialId: string;
    email: string;
    profileImageUrl: string;
    alarmAllowed: boolean;
    role: 'ADMIN' | 'USER' | 'DUMMY' | 'DISABLED_DUMMY';

    name?: string;
    gender?: string;
    birthYear?: string;
    phoneNumber?: string;
};