import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DonationsService } from '../donations/donations.service';
import { DonationStatus } from '@kushbhawanpur/shared';

export interface BankStatementRow {
  date?: string;
  description: string;
  refOrUtr?: string;
  creditAmount: number;
}

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  constructor(
    private prisma: PrismaService,
    private donationsService: DonationsService,
  ) {}

  /**
   * Parses CSV string into statement rows
   */
  parseCsv(content: string): BankStatementRow[] {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new BadRequestException('CSV file is empty or missing headers.');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
    const rows: BankStatementRow[] = [];

    // Identify column indices
    const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('txn'));
    const descIdx = headers.findIndex((h) => h.includes('desc') || h.includes('narration') || h.includes('particular'));
    const utrIdx = headers.findIndex((h) => h.includes('utr') || h.includes('ref') || h.includes('cheque'));
    const creditIdx = headers.findIndex((h) => h.includes('credit') || h.includes('deposit') || h.includes('amount'));

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length < 2) continue;

      const desc = descIdx >= 0 ? parts[descIdx] : parts[1] || '';
      const rawCredit = creditIdx >= 0 ? parts[creditIdx] : parts[parts.length - 1] || '0';
      const credit = parseFloat(rawCredit.replace(/[^0-9.]/g, '')) || 0;

      // Try extracting UTR from specific col or regex on narration
      let utr = utrIdx >= 0 && parts[utrIdx] ? parts[utrIdx] : '';
      if (!utr) {
        // Match 12-digit UPI UTR in description
        const utrMatch = desc.match(/\b\d{12}\b/);
        if (utrMatch) utr = utrMatch[0];
      }

      if (credit > 0) {
        rows.push({
          date: dateIdx >= 0 ? parts[dateIdx] : undefined,
          description: desc,
          refOrUtr: utr || undefined,
          creditAmount: credit,
        });
      }
    }

    return rows;
  }

  /**
   * Matches parsed bank statement entries against pending donations in database
   */
  async matchStatement(csvContent: string) {
    const rows = this.parseCsv(csvContent);

    // Fetch all pending donations
    const pendingDonations = await this.prisma.donation.findMany({
      where: {
        status: DonationStatus.PENDING_VERIFICATION,
      },
      include: { donor: true, seva: true },
    });

    const matches: any[] = [];
    const unmatchedRows: any[] = [];

    for (const row of rows) {
      const rowPaise = Math.round(row.creditAmount * 100);

      // Find matching donation by UTR or Reference ID
      const matched = pendingDonations.find((d) => {
        const utrMatches = row.refOrUtr && d.utr && d.utr.toLowerCase() === row.refOrUtr.toLowerCase();
        const refInDesc = d.refId && row.description.toUpperCase().includes(d.refId.toUpperCase());
        const amountMatches = Math.abs(d.amountPaise - rowPaise) < 100; // Within ₹1

        return (utrMatches || refInDesc) && amountMatches;
      });

      if (matched) {
        matches.push({
          statementRow: row,
          donation: {
            id: matched.id,
            refId: matched.refId,
            donorName: matched.donor.name,
            amountRupees: matched.amountPaise / 100,
            utr: matched.utr,
            sevaTitle: matched.seva.titleEn,
          },
          confidence: 'HIGH',
        });
      } else {
        unmatchedRows.push(row);
      }
    }

    return {
      totalRows: rows.length,
      matchedCount: matches.length,
      unmatchedCount: unmatchedRows.length,
      matches,
      unmatchedRows,
    };
  }

  /**
   * Bulk verifies matched donations from reconciliation
   */
  async bulkVerify(adminId: string, donationIds: string[], ip?: string) {
    const results = [];
    for (const id of donationIds) {
      try {
        const res = await this.donationsService.verifyDonation(id, adminId, {}, ip);
        results.push({ id, success: true, receiptNo: res.receiptNo });
      } catch (err: any) {
        results.push({ id, success: false, error: err.message });
      }
    }
    return { results, verifiedCount: results.filter((r) => r.success).length };
  }
}
