import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { formatINR } from '@kushbhawanpur/shared';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromName: string;
  private readonly fromAddress: string;
  private readonly siteUrl: string;

  constructor(private configService: ConfigService) {
    this.fromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      'Kushbhawanpur Sanatan Dharma & Heritage Foundation',
    );
    this.fromAddress = this.configService.get<string>(
      'MAIL_FROM_ADDRESS',
      'no-reply@kushbhawanpur.org',
    );
    this.siteUrl = this.configService.get<string>(
      'NEXT_PUBLIC_SITE_URL',
      'https://kushbhawanpur-sanatan-dharma-herita.vercel.app',
    );

    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.configService.get<number>('SMTP_PORT', 587)),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        auth: { user, pass },
      });
      this.logger.log(`MailService initialized with SMTP host: ${host}`);
    } else {
      this.logger.warn('SMTP credentials not configured. Outgoing emails will be logged to console in dev mode.');
    }
  }

  async sendDonationReceived(
    to: string,
    donorName: string,
    refId: string,
    amountRupees: number,
    sevaTitle: string,
  ): Promise<boolean> {
    const subject = `Payment Details Received — Ref: ${refId} | Kushbhawanpur Foundation`;
    const formattedAmount = formatINR(amountRupees);
    const statusUrl = `${this.siteUrl}/donation-status?ref=${refId}`;

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2A1A14; line-height: 1.6; background: #FFFDF8; padding: 24px; border: 1px solid #EADFC8; border-radius: 8px;">
        <h2 style="color: #7A1F14; margin-bottom: 4px;">धर्मो रक्षति रक्षितः</h2>
        <h3 style="color: #B8470A; margin-top: 0;">Payment Details Received</h3>
        <p>Namaste <strong>${donorName}</strong>,</p>
        <p>Thank you for submitting your payment proof for <strong>${sevaTitle}</strong>. We have recorded your contribution of <strong>${formattedAmount}</strong>.</p>
        <div style="background: #F6EBD6; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Donation Reference ID:</strong> <span style="font-family: monospace; font-size: 16px; color: #7A1F14;">${refId}</span></p>
          <p style="margin: 8px 0 0 0;"><strong>Status:</strong> Pending Bank Statement Verification</p>
        </div>
        <p>Our accounts team will verify the payment against our bank records. Your official, gapless donation receipt with a verification QR code will be generated and emailed to you shortly.</p>
        <p><a href="${statusUrl}" style="display: inline-block; background: #B8470A; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold;">Check Donation Status</a></p>
        <hr style="border: none; border-top: 1px solid #EADFC8; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6E5E54;">Kushbhawanpur Sanatan Dharma & Heritage Foundation · Kushbhawanpur (Sultanpur), Uttar Pradesh</p>
      </div>
    `;

    return this.sendMail(to, subject, html);
  }

  async sendReceiptEmail(
    to: string,
    donorName: string,
    receiptNo: string,
    amountRupees: number,
    sevaTitle: string,
    pdfBuffer: Buffer,
    verifyUrl: string,
  ): Promise<boolean> {
    const subject = `Official Donation Receipt: ${receiptNo} | Kushbhawanpur Foundation`;
    const formattedAmount = formatINR(amountRupees);

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2A1A14; line-height: 1.6; background: #FFFDF8; padding: 24px; border: 1px solid #EADFC8; border-radius: 8px;">
        <h2 style="color: #7A1F14; margin-bottom: 4px;">धर्मो रक्षति रक्षितः</h2>
        <h3 style="color: #3E7B3A; margin-top: 0;">Donation Verified · Official Receipt Attached</h3>
        <p>Pranam <strong>${donorName}</strong>,</p>
        <p>We are grateful to confirm that your generous seva offering of <strong>${formattedAmount}</strong> towards <strong>${sevaTitle}</strong> has been verified.</p>
        <div style="background: #F6EBD6; padding: 16px; border-radius: 6px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Official Receipt No:</strong> <span style="font-family: monospace; font-size: 16px; color: #7A1F14;">${receiptNo}</span></p>
          <p style="margin: 8px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        <p>Your official PDF receipt is attached to this email. You may also verify its validity online at any time:</p>
        <p><a href="${verifyUrl}" style="display: inline-block; background: #3E7B3A; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 20px; font-weight: bold;">Verify Receipt Online</a></p>
        <p>May your dedication bring peace, prosperity, and blessings to you and your family.</p>
        <hr style="border: none; border-top: 1px solid #EADFC8; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6E5E54;">Kushbhawanpur Sanatan Dharma & Heritage Foundation</p>
      </div>
    `;

    return this.sendMail(to, subject, html, [
      {
        filename: `Receipt-${receiptNo.replace(/\//g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ]);
  }

  async sendVerificationFailed(
    to: string,
    donorName: string,
    refId: string,
    reason: string,
  ): Promise<boolean> {
    const subject = `Update Regarding Donation Reference: ${refId} | Kushbhawanpur Foundation`;
    const statusUrl = `${this.siteUrl}/donation-status?ref=${refId}`;

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2A1A14; line-height: 1.6; background: #FFFDF8; padding: 24px; border: 1px solid #EADFC8; border-radius: 8px;">
        <h3 style="color: #7A1F14;">Verification Update for Donation ${refId}</h3>
        <p>Namaste <strong>${donorName}</strong>,</p>
        <p>Our accounts team was unable to match your payment with the bank statement records with the details provided.</p>
        <div style="background: #FDF2F2; border-left: 4px solid #7A1F14; padding: 12px; margin: 16px 0;">
          <p style="margin: 0; color: #7A1F14;"><strong>Reason noted by accounts:</strong> ${reason}</p>
        </div>
        <p>If you made the payment and have a different UTR number or an updated bank screenshot, please resubmit your proof via your status page:</p>
        <p><a href="${statusUrl}" style="display: inline-block; background: #B8470A; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 20px;">Resubmit Payment Proof</a></p>
      </div>
    `;

    return this.sendMail(to, subject, html);
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
    attachments: nodemailer.SendMailOptions['attachments'] = [],
  ): Promise<boolean> {
    if (!this.transporter) {
      this.logger.log(`[MOCK EMAIL to ${to}] Subject: "${subject}"`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromAddress}>`,
        to,
        subject,
        html,
        attachments,
      });
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      return false; // Email failure does not block database transactions
    }
  }
}
