import Image from "next/image";

export default function TweetLoader() {
  return (
    <div className="flex flex-col animate-bounce h-full items-center place-content-center">
      <div role="status">
        <Image
          className="ml-auto"
          src="/BlueTweet.svg"
          width={50}
          height={50}
          alt="Twitter PP"
          priority
        />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
