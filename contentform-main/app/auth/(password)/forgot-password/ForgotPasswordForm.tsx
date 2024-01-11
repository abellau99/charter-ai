"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import ErrorAlert from "@/app/components/ErrorAlert";
import ReCaptcha from "@/app/components/ReCaptcha";
import { FORM } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ButtonComponent from "../../../components/ButtonComponent";
import TextInputComponent from "../../../components/ControlInputComponent";

const forgotPasswordScheme = yup
  .object()
  .shape({
    email: yup.string().email().required().label(FORM.EMAIL),
  })
  .required();

interface IForgotPasswordProps {
  email: string;
}

const ForgotPasswordForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<{
    error: { message: string };
  } | null>(null);
  const { handleSubmit, control } = useForm<IForgotPasswordProps>({
    mode: "onBlur",
    resolver: yupResolver(forgotPasswordScheme),
    defaultValues: useMemo(() => ({ email: "" }), []),
  });

  const onSubmit: SubmitHandler<IForgotPasswordProps> = useCallback(
    async (data: IForgotPasswordProps) => {
      if (!executeRecaptcha) {
        console.log("Execute recaptcha not yet available");
        return;
      }

      executeRecaptcha("forgotPasswordSubmit").then(async (gReCaptchaToken) => {
        const res = await fetch("/api/users/forgot-password", {
          method: "POST",
          body: JSON.stringify({ ...data, gReCaptchaToken }),
        });
        if (!res.ok) {
          const errResponse = await res.json();
          setError(errResponse);
          return;
        }

        enqueueSnackbar(
          "Please check your email for the password reset link.",
          {
            variant: "success",
          }
        );

        router.replace("/auth/login");
      });
    },
    [router, enqueueSnackbar, executeRecaptcha]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-y-6">
        <TextInputComponent
          control={control}
          name="email"
          label={FORM.EMAIL}
          placeholder={FORM.EMAIL}
          id="email"
          type="email"
        />
      </div>

      <ErrorAlert error={error} />
      <ReCaptcha />

      <div className="mt-8">
        <ButtonComponent
          // disabled={!isValid}
          type="submit"
          className="transition ease-linear duration-75 delay-75 bg-tc-primary text-white hover:bg-tc-btn-hover"
        >
          Send
        </ButtonComponent>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
