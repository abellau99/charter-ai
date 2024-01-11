import { ReactNode } from "react";
import Wrapper from "../components/landing/Wrapper";
import TermsPrivacyContainer from "../components/privacy-tos/container";

const SectionHeader = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-tc-xl font-semibold">{children}</h2>;
};

const Section = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`my-4 p-4 ${className}`}>{children}</div>;
};

export default function Terms() {
  return (
    <Wrapper>
      <TermsPrivacyContainer title="Terms & Conditions">
        <div className="leading-6">
          <Section>
            <p>
              The following are the terms and conditions that you should abide
              by when using this app. It is important to read these terms and
              conditions carefully before downloading or using the app.
              contentform owns all the trademarks, copyright, database rights,
              and other intellectual property rights related to the app. As a
              user, you are not permitted to copy or modify the app, any part of
              the app, or the trademarks in any way. You are also not allowed to
              extract the app&apos;s source code or translate it into other
              languages or make derivative versions.
            </p>
            <br />
            <p>
              contentform is dedicated to making the app as useful and efficient
              as possible. Therefore, we reserve the right to make changes to
              the app or charge for its services at any time and for any reason.
              However, we will notify you of any charges, and we will not charge
              you for any services without explaining the charges.
            </p>
            <br />
            <p>
              The contentform app stores and processes your personal data to
              provide you with the best possible service. However, it is your
              responsibility to keep your phone and access to the app secure.
              Therefore, we recommend that you do not jailbreak or root your
              phone as it may make your phone vulnerable to malware and
              compromise the app&apos;s security features.
            </p>
            <br />
            <p>
              The app uses third-party services that have their own terms and
              conditions. Please check the terms and conditions of these
              services before using the app.
            </p>
            <br />
            <p>
              contentform cannot take responsibility for certain things when you
              use the app. For instance, if you don&apos;t have access to Wi-Fi
              or any data allowance left, the app may not work at full
              functionality. If you use the app outside your home territory, you
              may incur roaming data charges or other third-party charges. It is
              your responsibility to accept any such charges.
            </p>
            <br />
            <p>
              It is important to note that although we endeavor to ensure that
              the app is updated and correct at all times, we rely on third
              parties to provide us with information. Therefore, contentform
              accepts no liability for any loss, direct or indirect, that you
              experience as a result of relying solely on the app&apos;s
              functionality.
            </p>
          </Section>

          <Section>
            <SectionHeader>Changes to Terms and Conditions</SectionHeader>
            <p>
              We reserve the right to update our terms and conditions, and we
              will notify you of any changes by posting the new terms and
              conditions on this page. These terms and conditions are effective
              as of 2023-03-30.
            </p>
          </Section>

          <Section>
            <SectionHeader>Contact Us</SectionHeader>
            <p>
              If you have any questions or suggestions regarding our terms and
              conditions, please do not hesitate to contact us at&nbsp;
              <a
                href="mailo: contact@contentform.com"
                className="text-tc-primary-alt"
              >
                contact@contentform.com
              </a>
              .
            </p>
          </Section>
        </div>
      </TermsPrivacyContainer>
    </Wrapper>
  );
}
