export type SocialType = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'APPLE';

export function stringToSocialType(value: string): SocialType {
    switch (value.toUpperCase()) {
        case 'LOCAL':
            return 'LOCAL' as SocialType;
        case 'GOOGLE':
            return 'GOOGLE' as SocialType;
        case 'KAKAO':
            return "KAKAO" as SocialType;
        case 'APPLE':
            return "APPLE" as SocialType;
        default:
            return 'LOCAL' as SocialType;
    }
}