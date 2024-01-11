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

export default function PrivacyPolicy() {
  return (
    <Wrapper>
      <TermsPrivacyContainer title="Privacy Policy">
        <div className="leading-6">
          <Section>
            <p>
              Welcome to the Privacy Policy of the contentform app. This service
              is offered to you free of cost and is intended for use as is. This
              page is designed to inform you about our policies regarding the
              collection, use, and disclosure of Personal Information when you
              use our Service.
            </p>
            <p>
              By using our Service, you agree to the collection and use of
              information in accordance with this policy. The Personal
              Information that we collect is used for providing and improving
              the Service. We will not use or share your information with anyone
              except as described in this Privacy Policy.
            </p>
            <p>
              The terms used in this Privacy Policy have the same meanings as in
              our Terms and Conditions, which are accessible on the contentform
              app unless otherwise defined in this Privacy Policy.
            </p>
          </Section>

          <Section>
            <SectionHeader>Information Collection and Use</SectionHeader>
            <p>
              For a better user experience, we may require you to provide us
              with certain personally identifiable information while using our
              Service. The information that we ask for will be retained on your
              device and is not collected by us in any way.
            </p>

            <p>
              However, please note that the app uses third-party services that
              may collect information used to identify you. Here&apos;s a link
              to the privacy policy of third-party service providers used by the
              app:
            </p>

            <ul className="list-disc ml-8">
              <li>Google Analytics for Firebase</li>
              <li>Sentry</li>
              <li>Twitter API</li>
              <li>Log Data</li>
            </ul>

            <p>
              We want to inform you that whenever you use our Service and in the
              case of an error in the app, we collect data and information
              (through third-party products) on your phone called Log Data. This
              Log Data may include information such as your device&apos;s
              Internet Protocol (“IP”) address, device name, operating system
              version, the configuration of the app when utilizing our Service,
              the time and date of your use of the Service, and other
              statistics.
            </p>
          </Section>

          <Section>
            <SectionHeader>Cookies</SectionHeader>
            <p>
              Cookies are files with a small amount of data that are commonly
              used as anonymous unique identifiers. These are sent to your
              browser from the websites that you visit and are stored on your
              device&apos;s internal memory.
            </p>

            <p>
              This Service does not use these “cookies” explicitly. However, the
              app may use third-party code and libraries that use “cookies” to
              collect information and improve their services. You have the
              option to either accept or refuse these cookies and know when a
              cookie is being sent to your device. If you choose to refuse our
              cookies, you may not be able to use some portions of this Service.
            </p>
          </Section>

          <Section>
            <SectionHeader>Service Providers</SectionHeader>
            We may employ third-party companies and individuals for the
            following reasons:
            <ul className="list-disc ml-8">
              <li>To facilitate our Service;</li>
              <li>To provide the Service on our behalf;</li>
              <li>To perform Service-related services; or</li>
              <li>To assist us in analyzing how our Service is used.</li>
            </ul>
            We want to inform users of this Service that these third parties
            have access to their Personal Information. The reason is to perform
            the tasks assigned to them on our behalf. However, they are
            obligated not to disclose or use the information for any other
            purpose.
          </Section>

          <Section>
            <SectionHeader>Security</SectionHeader>
            <p>
              We value your trust in providing us your Personal Information,
              thus we are striving to use commercially acceptable means of
              protecting it. However, please remember that no method of
              transmission over the internet or method of electronic storage is
              100% secure and reliable, and we cannot guarantee its absolute
              security.
            </p>
          </Section>

          <Section>
            <SectionHeader>Links to Other Sites</SectionHeader>
            <p>
              Our Service may contain links to other sites. If you click on a
              third-party link, you will be directed to that site. Please note
              that these external sites are not operated by us. Therefore, we
              strongly advise you to review the Privacy Policy of these
              websites. We have no control over and assume no responsibility for
              the content, privacy policies, or practices of any third-party
              sites or services.
            </p>
          </Section>

          <Section>
            <SectionHeader>Children&apos;s Privacy</SectionHeader>
            <p>
              Children&apos;s Privacy is an important consideration for us. Our
              Service is not directed to anyone under the age of 13, and we do
              not knowingly collect personally identifiable information from
              children under 13 years of age. If we become aware that we have
              collected personal information from a child under the age of 13,
              we will take immediate action to delete it from our servers. If
              you are a parent or guardian and you believe that your child has
              provided us with personal information, please contact us so that
              we can take the necessary steps to address the issue.
            </p>
          </Section>

          <Section>
            <SectionHeader>Changes to This Privacy Policy</SectionHeader>
            <p>
              I reserve the right to modify this Privacy Policy at any time, and
              such modifications shall be effective immediately upon posting of
              the modified policy on this page. Your continued use of the
              Service after the modified Privacy Policy has been posted on this
              page shall constitute your acceptance of the modified Privacy
              Policy. It is your responsibility to review this Privacy Policy
              periodically. This policy is effective as of 2023-03-30.
            </p>
          </Section>

          <Section>
            <SectionHeader>Contact Us</SectionHeader>
            <p>
              If you have any questions or suggestions about our Privacy Policy,
              please feel free to contact us at any time at&nbsp;
              <a
                href="maito: contact@contentform.com"
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
