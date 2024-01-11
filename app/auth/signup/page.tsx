import { ALREADY_GOT_ACCOUNT } from "@/lib/constants";
import Link from "next/link";
import AuthLayout from "../../components/auth/AuthLayout";
import CustomContainer from "../../components/auth/CustomContainer";
import GoogleTwitterContainer from "../../components/auth/GoogleTwitterComponent";
import OrComponent from "../../components/auth/OrComponent";
import SignupForm from "./SignupForm";

export default function Home() {
  return (
    <AuthLayout>
      <CustomContainer
        title="Welcome"
        subtitle="Create an account to continue."
      >
        <div className="mt-12">
          <SignupForm />
        </div>

        <OrComponent />

        <GoogleTwitterContainer />

        <div className="flex justify-center gap-1 mt-8">
          <h1 className="text-tc-secondary text-tc-base">
            {ALREADY_GOT_ACCOUNT}
          </h1>
          <h1 className="ml-2 text-tc-primary text-tc-base font-bold">
            <Link href="/auth/login">Sign in</Link>
          </h1>
        </div>
      </CustomContainer>
    </AuthLayout>
    // <div className="grid grid-cols-2 h-screen bg-white">
    //   <CustomContainer
    //     title="Welcome!"
    //     subtitle="Create an account to continue"
    //   >
    //     <div className="mt-12">
    //       <SignupForm />
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
    //         Already got an account?
    //       </h1>
    //       <h1 className="text-tc-primary text-tc-base font-bold">
    //         <Link href="/">Sign in</Link>
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
