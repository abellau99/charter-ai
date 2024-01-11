import Pusher from "pusher-js";

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export const pusherChannel = (userId?: string) => {
  let channel = pusherClient.subscribe(`private_${userId}`);
  channel.unbind_all();
  return channel;
};

export default pusherClient;
