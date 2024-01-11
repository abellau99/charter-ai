import Section1 from "./components/landing/Section1";
import Section2 from "./components/landing/Section2";
import Section4 from "./components/landing/Section4";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Section3 from "./components/landing/Section3";
import Wrapper from "./components/landing/Wrapper";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard/create");
  }
  return (
    <Wrapper>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
    </Wrapper>
  );
}
