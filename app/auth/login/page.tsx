import Link from "next/link";
import AuthLayout from "../../components/auth/AuthLayout";
import CustomContainer from "../../components/auth/CustomContainer";
import GoogleTwitterContainer from "../../components/auth/GoogleTwitterComponent";
import OrComponent from "../../components/auth/OrComponent";
import LoginForm from "./LoginForm";

export default function Home() {
  return (
    <AuthLayout>
      <CustomContainer
        title="Log in to your account"
        subtitle="Welcome back! Please log in to continue"
      >
        <div className="mt-12">
          <LoginForm />
        </div>

        <OrComponent />

        <GoogleTwitterContainer />

        <div className="flex justify-center gap-1 mt-8">
          <h1 className="text-tc-secondary text-tc-base font-normal">
            Don&apos;t have an account?
          </h1>
          <h1 className="ml-2 text-tc-primary-alt text-tc-base font-medium">
            <Link href="/auth/signup">Sign up</Link>
          </h1>
        </div>
      </CustomContainer>
    </AuthLayout>
    // <div className="grid grid-cols-2 h-screen bg-white">
    //   <CustomContainer
    //     title="Login to your account"
    //     subtitle="Welcome back! Please login to continue"
    //   >
    //     <div className="mt-12">
    //       <LoginForm />
    //     </div>

    //     <div className="relative flex py-8 items-center">
    //       <div className="flex-grow border-t text-tc-secondary"></div>
    //       <span className="flex-shrink text-base mx-2 text-tc-secondary">
    //         or
    //       </span>
    //       <div className="flex-grow border-t text-tc-secondary"></div>
    //     </div>

    //     <div className="flex flex-col gap-3">
    //       <Link href="/signup-google">
    //         <ButtonComponent className="bg-transparent text-tc-primary border border-tc-primary">
    //           <div className="flex gap-x-4 justify-center">
    //             <Image
    //               src="/Google.svg"
    //               width={16}
    //               height={16}
    //               alt="Continue with Google"
    //             />
    //             <div>Continue with Google</div>
    //           </div>
    //         </ButtonComponent>
    //       </Link>

    //       <Link href="/signup-google">
    //         <ButtonComponent className="bg-transparent text-tc-primary border border-tc-primary">
    //           <div className="flex gap-x-4 justify-center">
    //             <Image
    //               src="/Twitter.svg"
    //               width={16}
    //               height={16}
    //               alt="Continue with Twitter"
    //             />
    //             <div>Continue with Twitter</div>
    //           </div>
    //         </ButtonComponent>
    //       </Link>
    //     </div>

    //     <div className="flex justify-center gap-1 mt-8">
    //       <h1 className="text-tc-secondary text-tc-base">
    //         Don&apos;t have an account?
    //       </h1>
    //       <h1 className="text-tc-primary text-tc-base font-bold">
    //         <Link href="/signup">Sign up</Link>
    //       </h1>
    //     </div>
    //   </CustomContainer>
    //   <div className="bg-secondary flex place-content-center">
    //     <Image
    //       src="/Vector.svg"
    //       width={102.5}
    //       height={90.3}
    //       alt="Continue with Twitter"
    //     />
    //   </div>
    // </div>
  );
}
