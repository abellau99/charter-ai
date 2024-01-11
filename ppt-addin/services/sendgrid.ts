import { IUser } from "@/models/User";
import sgMail, { MailDataRequired } from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const from_email: string = "hello@contentform.com";

export function sendWelcomeEmail(user: IUser) {
  const msg = {
    to: user.email,
    from: from_email,
    subject: "Welcome", // Subject is set in sendgrid
    templateId: "d-feac2f41da8a49b4a889b75cf8eba7bd",
    dynamicTemplateData: {
      verification_url: `${process.env.NEXTAUTH_URL}/api/users/verify?email=${user.email}&token=${user.verification.token}`,
    },
  };

  sendEmail(msg);
}

export function sendPasswordRequestEmail(user: IUser) {
  const msg = {
    to: user.email,
    from: from_email,
    subject: "Reset Password", // Subject is set in sendgrid
    templateId: "d-1fa63d95c9734be5ae1d69e041d1061d",
    dynamicTemplateData: {
      reset_url: `${process.env.NEXTAUTH_URL}/auth/reset-password?email=${user.email}&token=${user.passwordReset.token}`,
    },
  };
  sendEmail(msg);
}

function sendEmail(msg: MailDataRequired) {
  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
}
