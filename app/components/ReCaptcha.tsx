import Link from "next/link";

export default function ReCaptcha() {
  return (
    <div className="mt-4 text-[14px] text-tc-secondary font-light">
      This site is protected by reCAPTCHA and the Google{" "}
      <Link
        className="text-tc-primary-alt"
        href="https://policies.google.com/privacy"
      >
        Privacy Policy
      </Link>{" "}
      and
      <Link
        className="text-tc-primary-alt"
        href="https://policies.google.com/terms"
      >
        Terms of Service
      </Link>{" "}
      apply.
    </div>
  );
}
