type Chat = {
  id: string;
  sender_id: string;
  sender_nickname: string;
  profile_image_url: string;
  content: string;
  created_at: string;
  transparency: number;
  block_type: string;
  chat_type: string | undefined;
  optional:
    | {
        channel_name?: string;
        channel_url?: string;
        introduction_on_chat?: string;
        cta_on_chat?: string;
      }
    | undefined;
};