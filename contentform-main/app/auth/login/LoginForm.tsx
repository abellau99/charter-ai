"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import PasswordInputComponent from "@/app/components/ControlPasswordComponent";
import { FORGOT_PASSWORD, FORM } from "@/lib/constants";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ButtonComponent from "../../components/ButtonComponent";
import TextInputComponent from "../../components/ControlInputComponent";

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().email().required().label(FORM.EMAIL),
    password: yup.string().required().label(FORM.PASSWORD),
  })
  .required();

interface ILoginProps {
  email: string;
  password: string;
}

const LoginForm = () => {
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<ILoginProps>({
    mode: "onBlur",
    resolver: yupResolver(loginSchema),
    defaultValues: useMemo(
      () => ({ email: searchParams!.get("email") || "", password: "" }),
      [searchParams]
    ),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<ILoginProps> = useCallback(
    async (data) => {
      setLoading(true);
      const { email, password } = data as ILoginProps;
      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: searchParams!.get("callbackUrl") || "/dashboard/create",
      });
      // setLoading(false);
    },
    [searchParams]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-y-6">
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
      <div className="mt-4 flex justify-end">
        <Link
          className="text-tc-base font-medium text-tc-primary-alt"
          href="/auth/forgot-password"
        >
          {FORGOT_PASSWORD.HEADER}
        </Link>
      </div>
      <div className="mt-8">
        <ButtonComponent
          disabled={loading || !isValid}
          loading={loading}
          type="submit"
          className="glow-blue bg-tc-primary-alt text-white"
        >
          Log in
        </ButtonComponent>
        <div
          className={`mt-4 ${searchParams!.get("error") ? "visible" : "hidden"}`}
        >
          <div
            className="bg-red-100 border border-red-400 text-red-700 p-2 rounded-lg"
            role="alert"
          >
            <span className="block sm:inline">{searchParams!.get("error")}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
