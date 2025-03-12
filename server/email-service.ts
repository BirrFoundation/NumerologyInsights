import nodemailer from "nodemailer";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import cryptoRandomString from "crypto-random-string";

const scryptAsync = promisify(scrypt);

// Function to verify SMTP configuration
function verifySmtpConfig() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Missing SMTP configuration:', missing.join(', '));
    return false;
  }
  return true;
}

// Create a transporter using environment variables
let transporter: nodemailer.Transporter | null = null;
let lastConnectionAttempt = 0;
const CONNECTION_RETRY_INTERVAL = 60000; // 1 minute

async function getTransporter() {
  if (!verifySmtpConfig()) {
    throw new Error("SMTP configuration is incomplete");
  }

  const now = Date.now();
  if (transporter && (now - lastConnectionAttempt) < CONNECTION_RETRY_INTERVAL) {
    return transporter;
  }

  lastConnectionAttempt = now;

  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    });

    // Verify connection
    await transporter.verify();
    console.log('SMTP Server is ready to send emails');
    return transporter;
  } catch (error) {
    console.error('SMTP Connection Error:', error);
    transporter = null;
    throw new Error("Failed to connect to SMTP server");
  }
}

async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  throw lastError || new Error("Operation failed after retries");
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  console.log('Attempting to send verification email to:', email);

  const mailOptions = {
    from: `"Numerology App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Numerology Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Your Numerology Journey</h2>
        <p>Thank you for signing up! To complete your registration, please use the following verification code:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
          <h1 style="color: #6366f1; letter-spacing: 5px; margin: 0;">${code}</h1>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    const transport = await retryOperation(getTransporter);

    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER?.substring(0, 3) + '***'
    });

    const info = await retryOperation(() => transport.sendMail(mailOptions));
    console.log('Verification email sent successfully:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to send verification email");
  }
}

export async function sendResetEmail(email: string, code: string): Promise<void> {
  console.log('Attempting to send reset email to:', email);

  const mailOptions = {
    from: `"Numerology App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Numerology Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Please use the following code to complete the process:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
          <h1 style="color: #6366f1; letter-spacing: 5px; margin: 0;">${code}</h1>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email and ensure your account is secure.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  try {
    const transport = await retryOperation(getTransporter);
    const info = await retryOperation(() => transport.sendMail(mailOptions));
    console.log('Reset email sent successfully:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Failed to send reset email:', error);
    throw new Error(error instanceof Error ? error.message : "Failed to send reset email");
  }
}

export function generateVerificationCode(): string {
  return cryptoRandomString({
    length: 6,
    type: 'numeric'
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [hash, salt] = hashedPassword.split('.');
  const buf = await scryptAsync(password, salt, 64) as Buffer;
  return buf.toString('hex') === hash;
}