// lib/email.ts
import emailjs from '@emailjs/browser';

export const initEmailJS = () => {
  if (typeof window !== 'undefined') {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string)
  }
}

export interface EmailTemplateParams {
  [key: string]: string | number | undefined;
}

export const sendEmail = (templateParams: EmailTemplateParams) => {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
    templateParams
  );
};