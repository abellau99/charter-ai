import { ReactNode } from "react";

const SectionHeader = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-tc-xl font-semibold">{children}</h2>;
};

const Section = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`my-4 p-4 bg-blue-100 shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default function TermsPrivacyContainer({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="max-w-4xl mx-auto flex-col mt-8">
      <h1 className="text-center text-tc-3xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
