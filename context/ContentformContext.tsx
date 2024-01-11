import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface IContextProps {
  children: React.ReactNode;
}

interface IContentFormContextProps {
  globalDeadline: string | undefined;
  setGlobalDeadline: Dispatch<SetStateAction<string | undefined>>;
}

const ContentFormContext = createContext<IContentFormContextProps>({
  globalDeadline: undefined,
  setGlobalDeadline: () => {},
});

const ContentFormProvider = ({ children }: IContextProps) => {
  const [globalDeadline, setGlobalDeadline] = useState<string | undefined>(
    undefined
  );

  return (
    <ContentFormContext.Provider value={{ globalDeadline, setGlobalDeadline }}>
      {children}
    </ContentFormContext.Provider>
  );
};

export { ContentFormContext, ContentFormProvider };
