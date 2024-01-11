"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import PasswordInputComponent from "@/app/components/ControlPasswordComponent";
import ReCaptcha from "@/app/components/ReCaptcha";
import { FORM } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ButtonComponent from "../../components/ButtonComponent";
import TextInputComponent from "../../components/ControlInputComponent";
import VerifyEmailModal from "./VerifyEmailModal";

const signupSchema = yup
  .object()
  .shape({
    name: yup.string().required().label(FORM.NAME),
    email: yup.string().email().required().label(FORM.EMAIL),
    password: yup.string().required().label(FORM.PASSWORD),
  })
  .required();

interface ISignupProps {
  email: string;
  password: string;
}

const SignupForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const [signupError, setSignupError] = useState<{
    error: { message: string };
  } | null>(null);
  const [openVerify, setOpenVerify] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const closeModalHandler = useCallback(() => {
    setOpenVerify(false);
    router.replace("/auth/login");
  }, [setOpenVerify, router]);

  const {
    handleSubmit,
    control,
    formState: { isValid },
    reset,
  } = useForm<ISignupProps>({
    mode: "onBlur",
    resolver: yupResolver(signupSchema),
    defaultValues: useMemo(() => ({ email: "", password: "" }), []),
  });

  const onSubmit: SubmitHandler<ISignupProps> = async (data) => {
    setLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      setLoading(false);
      return;
    }

    executeRecaptcha("signupSubmit").then(async (gReCaptchaToken) => {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        body: JSON.stringify({ ...data, gReCaptchaToken }),
      });
      if (!res.ok) {
        const errResponse = await res.json();
        setSignupError(errResponse);
        setLoading(false);
        return;
      }
      const respData = await res.json();
      setOpenVerify(true);
      reset();
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-y-6">
          <TextInputComponent
            control={control}
            name="name"
            label={FORM.NAME}
            placeholder="Enter your name"
            id="name"
            type="text"
          />
          <TextInputComponent
            control={control}
            name="email"
            label={FORM.EMAIL}
            placeholder="Enter your email"
            id="email"
            type="email"
          />
          <PasswordInputComponent
            control={control}
            name="password"
            label={FORM.PASSWORD}
            placeholder={FORM.PASSWORD}
            id="password"
            type="password"
          />
        </div>
        <ReCaptcha />
        <div className="mt-8">
          <ButtonComponent
            disabled={!isValid}
            type="submit"
            className="glow-blue bg-tc-primary text-white hover:bg-tc-btn-hover"
            loading={loading}
          >
            Sign up
          </ButtonComponent>
        </div>
        <div className={`mt-4 ${signupError ? "visible" : "hidden"}`}>
          <div
            className="bg-red-100 border border-red-400 text-red-700 p-2 rounded-lg"
            role="alert"
          >
            <span className="block sm:inline">
              {signupError?.error?.message}
            </span>
          </div>
        </div>
      </form>
      <VerifyEmailModal open={openVerify} closeHandler={closeModalHandler} />
    </>
  );
};

export default SignupForm;
