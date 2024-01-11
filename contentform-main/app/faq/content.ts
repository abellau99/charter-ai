interface IHelpContents {
  title: string;
  body: string;
}

const faqs: IHelpContents[] = [
  {
    title: "How do I turn my tweets into videos?",
    body: "It's simple. All you have to do is paste the link of your tweet, choose a background, and watch the magic happen.",
  },
  {
    title: "Is there a free version available?",
    body: "Yes, you can create one video every day with contentform for free.",
  },
  {
    title: "Can I cancel my subscription?",
    body: "Yes, you can cancel your subscription at any time in the Subscription page within contentform.",
  },
  {
    title: "Will there be new features added to the product?",
    body: "Yes, we strive to be in the forefront of the industry with innovation and product, and we will constantly add new features and improve the product.",
  },
  {
    title: "Can I customize the appearance and style of the video?",
    body: "Yes, you can customize your background, colors, text and more.",
  },
  {
    title: "Is there a limit to the number of tweets I can create into videos?",
    body: "This depends if you have the free version or contentform PRO. With the free version, you can create one video every day. With contentform PRO, you can create an unlimited amount of content.",
  },
  {
    title: "How can I delete my account?",
    body: "To delete your account, please send an email to support@contentform.com from the email address associated with your account. In the email, please state your reasons for deletion.",
  },
];

export default faqs;
