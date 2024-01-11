export interface ITweetData {
  name: string;
  username: string;
  profileImageUrl: string;
  verified: boolean;
  createdAtDate: string;
  createdAtTime: string;
  tweetText: string;
  replyCount?: string;
  retweetCount?: string;
  likeCount?: string;
  impressionCount?: string;
  isBlueVerified?: boolean;
}

export interface ITweetUser {
  name: string;
  profile_image_url_https: string;
  screen_name: string;
  verified: boolean,
  is_blue_verified: boolean
}

export interface ITweetDataV2 {
  favorite_count: number;
  created_at: string,
  text: string
  user: ITweetUser;
  conversation_count: number;
}
