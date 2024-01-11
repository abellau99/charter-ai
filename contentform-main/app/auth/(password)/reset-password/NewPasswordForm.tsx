"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import ErrorAlert from "@/app/components/ErrorAlert";
import { FORM } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import ButtonComponent from "../../../components/ButtonComponent";
import TextInputComponent from "../../../components/ControlInputComponent";

const passwordSchema = yup.string().min(8).required();

const newPasswordSchema = yup
  .object()
  .shape({
    newPassword: passwordSchema.label(FORM.NEW_PASSWORD),
    confirmPassword: passwordSchema
      .label(FORM.CONFIRM_PASSWORD)
      .oneOf([yup.ref("newPassword")], "Passwords did not match")
      .required(),
  })
  .required();

interface INewPasswordParams {
  email: string | null;
  token?: string | null;
  newPassword: string;
  confirmPassword: string;
}

const NewPasswordForm = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const email = searchParams!.get("email");
  const token = searchParams!.get("token");
  const [error, setError] = useState<{
    error: { message: string };
  } | null>(null);
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<INewPasswordParams>({
    mode: "onBlur",
    resolver: yupResolver(newPasswordSchema),
    defaultValues: useMemo(
      () => ({ email, token, newPassword: "", confirmPassword: "" }),
      [email, token]
    ),
  });
  const onSubmit: SubmitHandler<INewPasswordParams> = async (data) => {
    if (data.email === "" || data.token === "") {
      return;
    }

    const res = await fetch("/api/users/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errResponse = await res.json();
      setError(errResponse);
      return;
    }

    enqueueSnackbar("Your password has been reset.", {
      variant: "success",
    });
    router.replace("/auth/login");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-y-6">
        <TextInputComponent
          control={control}
          name="newPassword"
          label={FORM.NEW_PASSWORD}
          placeholder={FORM.NEW_PASSWORD}
          id="newPassword"
          type="password"
        />
        <TextInputComponent
          control={control}
          name="confirmPassword"
          label={FORM.CONFIRM_PASSWORD}
          placeholder={FORM.CONFIRM_PASSWORD}
          id="confirmPassword"
          type="password"
        />
      </div>
      <ErrorAlert error={error} />
      <div className="mt-8">
        <ButtonComponent
          disabled={!isValid}
          type="submit"
          className="bg-tc-primary text-white enabled:hover:bg-tc-btn-hover"
        >
          Save
        </ButtonComponent>
      </div>
    </form>
  );
};

export default NewPasswordForm;
