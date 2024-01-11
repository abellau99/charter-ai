import Link from "next/link";
import { ReactNode } from "react";

interface ICustomContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
  includeBackButton?: boolean;
}

const CustomContainer = ({
  title,
  children,
  subtitle,
  className,
  includeBackButton = false,
}: ICustomContainerProps) => {
  return (
    <>
      {includeBackButton && (
        <Link href="/auth/login" className="text-tc-primary-alt mb-4 block">
          Back
        </Link>
      )}
      <h1 className="font-bold text-tc-3xl">{title}</h1>
      <h2 className="font-normal text-tc-base mt-3">{subtitle}</h2>
      {children}
    </>
  );
};

export default CustomContainer;
