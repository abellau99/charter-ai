export const EMAIL = "Email";
export const PASSWORD = "Password";

export const DIRECT_UPLOAD_KEY_TEMPLATE = "raw-uploads/%s/%s";

export const RAW_UPLOADS = {
  TWEET: "tweet.png",
  OVERLAY: "overlay.png",
};

export enum BackgroundType {
  Video = "VIDEO",
  Image = "IMAGE",
}

export enum CurationType {
  Landing = 'LANDING',
  Auth = 'AUTH'
}

export const STATUS = {
  UPLOADING: "Uploading",
  PREPARING: "Preparing assets",
  CREATING: "Creating",
  PROCESSING: "Creating your content",
};

export enum PusherEvents {
  ContentCreated = "CONTENT_CREATED",
  ContentCreationFailed = "CONTENT_CREATION_FAILED",
}

interface IPATH {
  MY_VIDEOS: string;
  CREATE: string;
  SUBSCRIPTION: string;
  HELP: string;
}

export const PATH_TITLE: IPATH = {
  MY_VIDEOS: "My content",
  CREATE: "Create content",
  SUBSCRIPTION: "Subscription",
  HELP: "Help",
};

export const PATHS: IPATH = {
  MY_VIDEOS: "/dashboard/my-videos",
  CREATE: "/dashboard/create",
  SUBSCRIPTION: "/dashboard/subscription",
  HELP: "/dashboard/help",
};

export const FORM = {
  NAME: "Name",
  EMAIL: "Email",
  PASSWORD: "Password",
  NEW_PASSWORD: "New password",
  CONFIRM_PASSWORD: "Confirm password",
};

export const VIDEO_FORM = {
  TWEET_LINK: "Tweet link",
  BACKGROUND_FOOTAGE_URL: "Background footage",
  BACKGROUND_URL: "Background URL",
  BACKGROUND_OVERLAY: "Background overlay",
  OVERLAY_COLOR: "Overlay Color",
  OVERLAY_OPACITY: "Overlay Opacity",
  COLOR_THEME: "Color theme",
  OPACITY: "Opacity",
  TEXT_COLOR: "Text color",
  SHOW_VERIFIED_ICON: "Show verified icon",
  SHOW_DATE: "Show date",
  SHOW_ENGAGEMENT: "Show engagements",
  SHOW_HEADER: "Show header",
  SHOW_TWITTER_LOGO: "Show logo",
  TEXT_SIZE: "Text size",
};

export const PROVIDERS = {
  CREDENTIALS: "credentials",
  GOOGLE: "google",
  TWITTER: "twitter",
};

export const SUBSCRIPTION = {
  HEADER: "Pricing plans",
  SUB_HEADER: "Upgrade anytime, cancel anytime.",
  MANAGE_SUBSCRIPTION: "Manage subscription",
};

export const FORGOT_PASSWORD = {
  HEADER: "Forgot password",
};

export const ALREADY_GOT_ACCOUNT = "Already got an account?";

export const BUTTON = {
  CREATE: "Create content",
};
