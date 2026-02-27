import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a recovery link has been sent." });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Save the token
    await prisma.passwordResetToken.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@tradersjournal.app",
      to: email,
      subject: "Password Recovery — Trader's Journal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; border-radius: 12px; color: #e2e8f0;">
          <h1 style="color: #60a5fa; margin-bottom: 8px;">Trader's Journal</h1>
          <h2 style="color: #f1f5f9; font-size: 20px;">Password Recovery</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">
          <p style="color: #64748b; font-size: 12px;">
            Trader's Journal &copy; ${new Date().getFullYear()}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Recovery link sent" });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to send recovery email. Please try again." },
      { status: 500 }
    );
  }
}
