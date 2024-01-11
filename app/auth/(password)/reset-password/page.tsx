import AuthLayout from "../../../components/auth/AuthLayout";
import CustomContainer from "../../../components/auth/CustomContainer";
import NewPasswordForm from "./NewPasswordForm";

export default function Home() {
  return (
    <AuthLayout>
      <CustomContainer
        title="Create new Password"
        subtitle="Please enter new password"
      >
        <div className="mt-12">
          <NewPasswordForm />
        </div>
      </CustomContainer>
    </AuthLayout>
  );
}
