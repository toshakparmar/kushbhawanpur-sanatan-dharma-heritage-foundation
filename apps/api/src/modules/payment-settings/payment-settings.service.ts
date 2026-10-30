import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EncryptionService } from '../../common/services/encryption.service';
import { AuditService } from '../../common/services/audit.service';

@Injectable()
export class PaymentSettingsService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
    private auditService: AuditService,
  ) {}

  async getSettings() {
    return this.prisma.paymentSettings.findUnique({
      where: { id: 'singleton' },
    });
  }

  async updateSettings(adminId: string, dto: any, ip?: string) {
    const updated = await this.prisma.paymentSettings.upsert({
      where: { id: 'singleton' },
      update: { ...dto },
      create: { id: 'singleton', ...dto },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'PAYMENT_SETTINGS_UPDATED',
      entity: 'PaymentSettings',
      entityId: 'singleton',
      ip,
    });

    return updated;
  }

  // UPI Accounts
  async getUpiAccounts() {
    return this.prisma.upiAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createUpiAccount(adminId: string, dto: any, ip?: string) {
    if (dto.isPrimary) {
      await this.prisma.upiAccount.updateMany({
        data: { isPrimary: false },
      });
    }

    const account = await this.prisma.upiAccount.create({
      data: {
        label: dto.label,
        vpa: dto.vpa.toLowerCase().trim(),
        payeeName: dto.payeeName.trim(),
        isPrimary: Boolean(dto.isPrimary),
        active: dto.active !== undefined ? Boolean(dto.active) : true,
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'UPI_ACCOUNT_CREATED',
      entity: 'UpiAccount',
      entityId: account.id,
      meta: { vpa: account.vpa },
      ip,
    });

    return account;
  }

  async updateUpiAccount(adminId: string, id: string, dto: any, ip?: string) {
    if (dto.isPrimary) {
      await this.prisma.upiAccount.updateMany({
        where: { id: { not: id } },
        data: { isPrimary: false },
      });
    }

    const updated = await this.prisma.upiAccount.update({
      where: { id },
      data: {
        ...(dto.label && { label: dto.label }),
        ...(dto.vpa && { vpa: dto.vpa.toLowerCase().trim() }),
        ...(dto.payeeName && { payeeName: dto.payeeName.trim() }),
        ...(dto.isPrimary !== undefined && { isPrimary: Boolean(dto.isPrimary) }),
        ...(dto.active !== undefined && { active: Boolean(dto.active) }),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'UPI_ACCOUNT_UPDATED',
      entity: 'UpiAccount',
      entityId: id,
      ip,
    });

    return updated;
  }

  async deleteUpiAccount(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.upiAccount.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'UPI_ACCOUNT_DELETED',
      entity: 'UpiAccount',
      entityId: id,
      ip,
    });

    return deleted;
  }

  // Bank Accounts
  async getBankAccounts() {
    const accounts = await this.prisma.bankAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return accounts.map((acc) => {
      let masked = '****';
      try {
        const decrypted = this.encryptionService.decrypt(acc.accountNumberEnc);
        masked = `****${decrypted.slice(-4)}`;
      } catch {}
      return {
        id: acc.id,
        holder: acc.holder,
        accountNumberMasked: masked,
        ifsc: acc.ifsc,
        bank: acc.bank,
        branch: acc.branch,
        type: acc.type,
        showPublic: acc.showPublic,
        createdAt: acc.createdAt,
      };
    });
  }

  async createBankAccount(adminId: string, dto: any, ip?: string) {
    const accountNumberEnc = this.encryptionService.encrypt(dto.accountNumber.trim());

    const account = await this.prisma.bankAccount.create({
      data: {
        holder: dto.holder.trim(),
        accountNumberEnc,
        ifsc: dto.ifsc.toUpperCase().trim(),
        bank: dto.bank.trim(),
        branch: dto.branch?.trim() || null,
        type: dto.type || 'Savings',
        showPublic: Boolean(dto.showPublic),
      },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'BANK_ACCOUNT_CREATED',
      entity: 'BankAccount',
      entityId: account.id,
      ip,
    });

    return { id: account.id, holder: account.holder, bank: account.bank };
  }

  async updateBankAccount(adminId: string, id: string, dto: any, ip?: string) {
    const data: any = {
      ...(dto.holder && { holder: dto.holder.trim() }),
      ...(dto.ifsc && { ifsc: dto.ifsc.toUpperCase().trim() }),
      ...(dto.bank && { bank: dto.bank.trim() }),
      ...(dto.branch !== undefined && { branch: dto.branch?.trim() || null }),
      ...(dto.type && { type: dto.type }),
      ...(dto.showPublic !== undefined && { showPublic: Boolean(dto.showPublic) }),
    };

    if (dto.accountNumber) {
      data.accountNumberEnc = this.encryptionService.encrypt(dto.accountNumber.trim());
    }

    const updated = await this.prisma.bankAccount.update({
      where: { id },
      data,
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'BANK_ACCOUNT_UPDATED',
      entity: 'BankAccount',
      entityId: id,
      ip,
    });

    return { id: updated.id, holder: updated.holder };
  }

  async deleteBankAccount(adminId: string, id: string, ip?: string) {
    const deleted = await this.prisma.bankAccount.delete({
      where: { id },
    });

    await this.auditService.log({
      actorId: adminId,
      action: 'BANK_ACCOUNT_DELETED',
      entity: 'BankAccount',
      entityId: id,
      ip,
    });

    return deleted;
  }
}
