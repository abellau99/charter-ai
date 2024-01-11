import Link from "next/link";

export default function PaywallOverlay() {
  return (
    <div className="absolute top-0 left-0 w-full h-full  z-50">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <Link
          href="/dashboard/subscription"
          className="px-4 py-4 text-white rounded-lg bg-tc-primary-alt hover:bg-tc-primary-alt-dark"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
