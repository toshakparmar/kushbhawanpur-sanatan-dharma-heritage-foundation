import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';
import { amountInWords, formatINR } from '@kushbhawanpur/shared';

export interface ReceiptPdfData {
  receiptNo: string;
  fy: string;
  issuedAt: Date;
  donationRefId: string;
  amountRupees: number;
  sevaTitle: string;
  method: string;
  utr?: string;
  paymentAt?: Date;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress?: string;
  donorPan?: string;
  isVoid?: boolean;
  voidReason?: string;
  orgNameEn: string;
  orgNameHi?: string;
  orgAddress?: string;
  orgPhone?: string;
  orgEmail?: string;
  orgPan?: string;
  orgRegNo?: string;
  approval80G?: string;
  approval12A?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
  signatureUrl?: string;
  footerNote?: string;
  verifyUrl: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generateDonationReceipt(data: ReceiptPdfData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40,
          info: {
            Title: `Receipt - ${data.receiptNo}`,
            Author: data.orgNameEn,
            Subject: 'Donation Seva Receipt',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        const pageWidth = 595.28;
        const pageHeight = 841.89;

        // Outer border
        doc
          .rect(20, 20, pageWidth - 40, pageHeight - 40)
          .lineWidth(1.5)
          .strokeColor('#D4A02C')
          .stroke();

        // Inner hairline border
        doc
          .rect(23, 23, pageWidth - 46, pageHeight - 46)
          .lineWidth(0.5)
          .strokeColor('#EADFC8')
          .stroke();

        // Void Watermark if voided
        if (data.isVoid) {
          doc.save();
          doc
            .fontSize(64)
            .fillColor('#D32F2F', 0.15)
            .rotate(-35, { origin: [pageWidth / 2, pageHeight / 2] })
            .text('VOID / CANCELLED', pageWidth / 2 - 200, pageHeight / 2 - 50);
          doc.restore();
        }

        let y = 45;

        // Header Title
        doc
          .fillColor('#7A1F14')
          .font('Helvetica-Bold')
          .fontSize(18)
          .text(data.orgNameEn, 40, y, { align: 'center' });

        y += 24;
        doc
          .fillColor('#6E5E54')
          .font('Helvetica')
          .fontSize(9)
          .text(
            `${data.orgAddress || 'Kushbhawanpur (Sultanpur), Uttar Pradesh, India'} | Email: ${data.orgEmail || 'info@kushbhawanpur.org'}`,
            40,
            y,
            { align: 'center' },
          );

        // Registration chips if present
        const regParts: string[] = [];
        if (data.orgRegNo) regParts.push(`Reg No: ${data.orgRegNo}`);
        if (data.orgPan) regParts.push(`PAN: ${data.orgPan}`);
        if (data.approval80G) regParts.push(`80G Exemption: ${data.approval80G}`);
        if (data.approval12A) regParts.push(`12A Reg: ${data.approval12A}`);

        if (regParts.length > 0) {
          y += 14;
          doc
            .fillColor('#2A1A14')
            .font('Helvetica-Bold')
            .fontSize(8)
            .text(regParts.join('  |  '), 40, y, { align: 'center' });
        }

        y += 20;
        // Horizontal divider
        doc
          .moveTo(40, y)
          .lineTo(pageWidth - 40, y)
          .lineWidth(1)
          .strokeColor('#D4A02C')
          .stroke();

        y += 15;

        // Receipt Banner Title
        doc
          .rect(40, y, pageWidth - 80, 24)
          .fillColor('#FFF9EF')
          .fill();

        doc
          .fillColor('#7A1F14')
          .font('Helvetica-Bold')
          .fontSize(12)
          .text('OFFICIAL DONATION RECEIPT', 40, y + 6, { align: 'center' });

        y += 36;

        // Metadata grid: Left (Receipt details), Right (Date & Ref)
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#7A1F14').text('Receipt No:', 45, y);
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#2A1A14').text(data.receiptNo, 120, y);

        doc.font('Helvetica-Bold').fontSize(10).fillColor('#7A1F14').text('Date of Issue:', 340, y);
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#2A1A14')
          .text(new Date(data.issuedAt).toLocaleDateString('en-IN'), 430, y);

        y += 18;
        doc.font('Helvetica').fontSize(9).fillColor('#6E5E54').text('Financial Year:', 45, y);
        doc.font('Helvetica').fontSize(9).fillColor('#2A1A14').text(data.fy, 120, y);

        doc.font('Helvetica').fontSize(9).fillColor('#6E5E54').text('Reference ID:', 340, y);
        doc.font('Helvetica').fontSize(9).fillColor('#2A1A14').text(data.donationRefId, 430, y);

        y += 24;

        // Donor details box
        doc
          .rect(40, y, pageWidth - 80, 75)
          .lineWidth(0.8)
          .strokeColor('#EADFC8')
          .fillColor('#FFFDF8')
          .fillAndStroke();

        doc.fillColor('#7A1F14').font('Helvetica-Bold').fontSize(9).text('DONOR DETAILS', 50, y + 8);

        doc.font('Helvetica-Bold').fontSize(10).fillColor('#2A1A14').text(data.donorName, 50, y + 24);

        let donorContact = `Phone: ${data.donorPhone} | Email: ${data.donorEmail}`;
        if (data.donorPan) {
          donorContact += ` | PAN: ${data.donorPan}`;
        }
        doc.font('Helvetica').fontSize(8.5).fillColor('#6E5E54').text(donorContact, 50, y + 40);

        if (data.donorAddress) {
          doc.font('Helvetica').fontSize(8).fillColor('#6E5E54').text(`Address: ${data.donorAddress}`, 50, y + 54);
        }

        y += 90;

        // Seva & Contribution Details Table
        doc
          .rect(40, y, pageWidth - 80, 20)
          .fillColor('#F6EBD6')
          .fill();

        doc.fillColor('#7A1F14').font('Helvetica-Bold').fontSize(9).text('SEVA / PURPOSE', 50, y + 5);
        doc.text('PAYMENT MODE & REF', 260, y + 5);
        doc.text('AMOUNT (INR)', 430, y + 5, { align: 'right', width: pageWidth - 80 - 430 });

        y += 20;

        doc
          .rect(40, y, pageWidth - 80, 48)
          .lineWidth(0.5)
          .strokeColor('#EADFC8')
          .fillColor('#FFFFFF')
          .fillAndStroke();

        doc.fillColor('#2A1A14').font('Helvetica-Bold').fontSize(10).text(data.sevaTitle, 50, y + 10, { width: 200 });

        const refText = data.utr ? `UTR: ${data.utr}` : 'Direct Transfer';
        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#6E5E54')
          .text(`${data.method}\n${refText}`, 260, y + 10, { width: 160 });

        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#B8470A')
          .text(formatINR(data.amountRupees, true), 420, y + 12, {
            align: 'right',
            width: pageWidth - 80 - 430,
          });

        y += 56;

        // Amount in Words
        doc
          .rect(40, y, pageWidth - 80, 26)
          .fillColor('#FFF9EF')
          .fill();

        doc.font('Helvetica-Bold').fontSize(9).fillColor('#7A1F14').text('Amount in Words:', 50, y + 8);
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#2A1A14')
          .text(amountInWords(data.amountRupees), 145, y + 8, { width: 380 });

        y += 40;

        // 80G Statutory Notice (Only if configured)
        if (data.approval80G) {
          doc
            .rect(40, y, pageWidth - 80, 32)
            .lineWidth(0.5)
            .strokeColor('#3E7B3A')
            .fillColor('#F1F8F1')
            .fillAndStroke();

          doc
            .fillColor('#3E7B3A')
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .text(
              `Income Tax Exemption: Donations are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. Approval No: ${data.approval80G}.`,
              50,
              y + 6,
              { width: pageWidth - 100 },
            );
          y += 44;
        }

        // Verification QR & Signatory block
        const qrImageBuffer = await QRCode.toBuffer(data.verifyUrl, {
          width: 80,
          margin: 1,
          color: { dark: '#2A1A14', light: '#FFFFFF' },
        });

        doc.image(qrImageBuffer, 50, y, { width: 70, height: 70 });
        doc
          .font('Helvetica')
          .fontSize(7.5)
          .fillColor('#6E5E54')
          .text('Scan with any mobile\ncamera to verify\nreceipt authenticity', 130, y + 16);

        // Signatory on Right
        const sigX = 360;
        doc
          .moveTo(sigX, y + 45)
          .lineTo(pageWidth - 60, y + 45)
          .lineWidth(0.8)
          .strokeColor('#D4A02C')
          .stroke();

        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#2A1A14')
          .text(data.signatoryName || 'Authorized Signatory', sigX, y + 50, { align: 'center', width: 175 });

        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor('#6E5E54')
          .text(
            data.signatoryDesignation || 'Trustee / Accounts Officer',
            sigX,
            y + 62,
            { align: 'center', width: 175 },
          );

        y += 85;

        // Footer Note
        const note =
          data.footerNote ||
          'This is a digitally generated official receipt issued under the authority of the Board of Trustees. No physical signature is required.';
        doc
          .font('Helvetica-Oblique')
          .fontSize(7.5)
          .fillColor('#8C7D73')
          .text(note, 40, y, { align: 'center', width: pageWidth - 80 });

        doc.end();
      } catch (err: any) {
        this.logger.error(`Failed to generate receipt PDF: ${err.message}`);
        reject(err);
      }
    });
  }
}
