"use client";

import { signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import ButtonComponent from "../components/ButtonComponent";

export default function Logout() {
  const { enqueueSnackbar } = useSnackbar();
  const logout = useCallback(() => {
    enqueueSnackbar("Logged out!");
    signOut({ callbackUrl: "/" });
  }, [enqueueSnackbar]);

  return (
    <ButtonComponent onClick={logout} className="bg-tc-primary text-white">
      Logout
    </ButtonComponent>
  );
}
