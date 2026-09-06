import nodemailer from "nodemailer";

export interface PrivateEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

export interface PrivateEmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required Private Email setting: ${name}`);
  return value;
}

export function getPrivateEmailConfig(): PrivateEmailConfig {
  const port = Number(requireEnv("PRIVATE_EMAIL_SMTP_PORT"));
  if (!Number.isInteger(port) || port <= 0) throw new Error("PRIVATE_EMAIL_SMTP_PORT must be a positive integer");

  const secureValue = requireEnv("PRIVATE_EMAIL_SMTP_SECURE").toLowerCase();
  if (secureValue !== "true" && secureValue !== "false") {
    throw new Error("PRIVATE_EMAIL_SMTP_SECURE must be true or false");
  }

  return {
    host: requireEnv("PRIVATE_EMAIL_SMTP_HOST"),
    port,
    secure: secureValue === "true",
    user: requireEnv("PRIVATE_EMAIL_SMTP_USER"),
    password: requireEnv("PRIVATE_EMAIL_SMTP_PASSWORD"),
    from: requireEnv("PRIVATE_EMAIL_FROM"),
  };
}

export function createPrivateEmailTransporter() {
  const config = getPrivateEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
  });
}

/** Performs SMTP connection and authentication only. It does not send a message. */
export async function verifyPrivateEmailSmtp(): Promise<boolean> {
  await createPrivateEmailTransporter().verify();
  return true;
}

export async function sendPrivateEmail(message: PrivateEmailMessage): Promise<nodemailer.SentMessageInfo> {
  const config = getPrivateEmailConfig();
  return createPrivateEmailTransporter().sendMail({
    from: config.from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}
