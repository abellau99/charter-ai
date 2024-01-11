import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";

const useOptimizedSession = () => {
  const { data: session, status } = useSession();

  const optimizedSession = useMemo(() => session, [session]);

  useEffect(() => {
    // Handle any side effects related to the session status, if needed
    // ...

    // Example:
    if (status === "loading") {
      // Display a loading indicator or skeleton screen
    } else if (!session) {
      // Redirect the user to the login page
    } else {
      // Session is available, perform necessary actions
    }
  }, [status, session]);

  return optimizedSession;
};

export default useOptimizedSession;
