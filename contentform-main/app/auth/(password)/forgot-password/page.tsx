import { FORGOT_PASSWORD } from "@/lib/constants";
import Link from "next/link";
import AuthLayout from "../../../components/auth/AuthLayout";
import CustomContainer from "../../../components/auth/CustomContainer";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function Home() {
  return (
    <AuthLayout>
      <CustomContainer
        title={FORGOT_PASSWORD.HEADER}
        subtitle="Enter the email address associated with your account"
        includeBackButton={true}
      >
        <div className="mt-12">
          <ForgotPasswordForm />
        </div>
      </CustomContainer>
    </AuthLayout>
  );
}
