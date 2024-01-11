import Link from "next/link";
import { ReactNode } from "react";

interface ILinkProps {
  children: ReactNode;
  href: string;
  className?: string;
}

export function PrimaryButtonLink({ children, href, className }: ILinkProps) {
  return (
    <Link
      href={href}
      className={`text-center text-tc-xl font-bold py-4 px-14 mob-max:p-4 rounded-lg bg-tc-primary text-white ${className}`}
    >
      {children}
    </Link>
  );
}

export function SecondaryButtonLink({ children, href, className }: ILinkProps) {
  return (
    <Link
      href={href}
      className={`text-center text-tc-xl font-bold py-4 px-14 rounded-lg bg-[#ECF0F1] text-tc-primary ${className}`}
    >
      {children}
    </Link>
  );
}
