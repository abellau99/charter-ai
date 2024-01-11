import Image from "next/image";

export default function TweetcastLoader({
  animation = "animate-ping",
}: {
  animation?: string;
}) {
  return (
    <div
      className={`flex flex-col ${animation} h-full items-center place-content-center`}
    >
      <div role="status">
        <Image
          className="ml-auto"
          src="/ContentForm.svg"
          width={150}
          height={0}
          alt="ContentForm Loader"
          priority
        />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
