interface IErrorProps {
  error: {
    error: {
      message: string;
    };
  } | null;
}

export default function ErrorAlert({ error }: IErrorProps) {
  return (
    <div className={`mt-4 ${error ? "visible" : "hidden"}`}>
      <div
        className="bg-red-100 border border-red-400 text-red-700 p-2 rounded-lg"
        role="alert"
      >
        <span className="block sm:inline">{error?.error?.message}</span>
      </div>
    </div>
  );
}
