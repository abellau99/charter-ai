type buttonProps = {
  children: any;
  className?: string;
};

const OutlineButtonComponent = ({ children, className }: buttonProps) => {
  return (
    <button
      className={`${className} w-full bg-transparent text-tc-primary rounded-lg p-3.5 `}
    >
      {children}
    </button>
  );
};

export default OutlineButtonComponent;
