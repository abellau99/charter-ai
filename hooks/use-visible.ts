import { useEffect, useRef, useState } from "react";

function useVisible(initialIsVisible: boolean) {
  const [isVisible, setIsVisible] = useState<boolean>(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent): void => {
    if (ref.current) {
      if (!ref.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isVisible, setIsVisible };
}

export default useVisible;
