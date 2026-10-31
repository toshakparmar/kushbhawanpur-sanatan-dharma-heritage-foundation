import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CmsService {
  private readonly logger = new Logger(CmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // 1. PAGE SECTIONS & DRAFT/PUBLISH WORKFLOW
  // ==========================================

  async getSections() {
    return this.prisma.pageSection.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getSection(key: string) {
    const section = await this.prisma.pageSection.findUnique({
      where: { key },
    });
    if (!section) {
      throw new NotFoundException(`Section with key "${key}" not found.`);
    }
    return section;
  }

  async updateSectionDraft(
    key: string,
    data: { draftContent?: any; variant?: string; enabled?: boolean; sortOrder?: number },
    userEmail?: string,
  ) {
    await this.getSection(key);
    return this.prisma.pageSection.update({
      where: { key },
      data: {
        ...(data.draftContent !== undefined && { draftContent: data.draftContent }),
        ...(data.variant !== undefined && { variant: data.variant }),
        ...(data.enabled !== undefined && { enabled: data.enabled }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        updatedBy: userEmail || 'admin',
      },
    });
  }

  async publishSection(key: string, userEmail?: string) {
    const section = await this.getSection(key);
    const publishedContent = section.draftContent;

    const [updatedSection] = await this.prisma.$transaction([
      this.prisma.pageSection.update({
        where: { key },
        data: {
          publishedContent,
          publishedAt: new Date(),
          updatedBy: userEmail || 'admin',
        },
      }),
      this.prisma.pageSectionVersion.create({
        data: {
          sectionKey: key,
          content: publishedContent as any,
          publishedBy: userEmail || 'admin',
        },
      }),
    ]);

    return updatedSection;
  }

  async revertSection(key: string) {
    const section = await this.getSection(key);
    return this.prisma.pageSection.update({
      where: { key },
      data: {
        draftContent: section.publishedContent as any,
      },
    });
  }

  async getSectionVersions(key: string) {
    return this.prisma.pageSectionVersion.findMany({
      where: { sectionKey: key },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });
  }

  async restoreSectionVersion(key: string, versionId: string) {
    const version = await this.prisma.pageSectionVersion.findUnique({
      where: { id: versionId },
    });
    if (!version || version.sectionKey !== key) {
      throw new NotFoundException('Version not found for this section.');
    }

    return this.prisma.pageSection.update({
      where: { key },
      data: {
        draftContent: version.content as any,
      },
    });
  }

  async reorderSections(items: { key: string; sortOrder: number }[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.pageSection.update({
          where: { key: item.key },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return { success: true };
  }

  // ==========================================
  // 2. REPEATING ENTITIES (RELATIONAL ITEMS)
  // ==========================================

  private getModel(entity: string): any {
    const map: Record<string, any> = {
      'hero-slides': this.prisma.heroSlide,
      'trust-items': this.prisma.trustItem,
      'value-pillars': this.prisma.valuePillar,
      'focus-areas': this.prisma.focusArea,
      'story-chapters': this.prisma.storyChapter,
      'impact-items': this.prisma.impactItem,
      'donor-benefits': this.prisma.donorBenefit,
      'gallery-items': this.prisma.galleryItem,
      'involve-cards': this.prisma.involveCard,
      'faq-items': this.prisma.faqItem,
      'nav-items': this.prisma.navItem,
      'announcements': this.prisma.announcement,
    };
    const model = map[entity];
    if (!model) {
      throw new BadRequestException(`Unknown entity: "${entity}"`);
    }
    return model;
  }

  async getItems(entity: string) {
    const model = this.getModel(entity);
    return model.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createItem(entity: string, data: any) {
    const model = this.getModel(entity);
    return model.create({ data });
  }

  async updateItem(entity: string, id: string, data: any) {
    const model = this.getModel(entity);
    return model.update({
      where: { id },
      data,
    });
  }

  async deleteItem(entity: string, id: string) {
    const model = this.getModel(entity);
    return model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async reorderItems(entity: string, items: { id: string; sortOrder: number }[]) {
    const model = this.getModel(entity);
    await this.prisma.$transaction(
      items.map((item) =>
        model.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return { success: true };
  }

  // ==========================================
  // 3. SITE SETTINGS & POLICIES
  // ==========================================

  async getSiteSettings() {
    return this.prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    });
  }

  async updateSiteSettings(data: any) {
    return this.prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        ...data,
      },
    });
  }

  async getPolicies() {
    return this.prisma.policyPage.findMany({
      where: { deletedAt: null },
      orderBy: { titleEn: 'asc' },
    });
  }

  async getPolicy(slug: string) {
    const policy = await this.prisma.policyPage.findUnique({ where: { slug } });
    if (!policy) throw new NotFoundException('Policy page not found.');
    return policy;
  }

  async updatePolicy(slug: string, data: any) {
    return this.prisma.policyPage.upsert({
      where: { slug },
      update: data,
      create: {
        slug,
        ...data,
      },
    });
  }

  // ==========================================
  // 4. INBOX (CONTACT & VOLUNTEERS)
  // ==========================================

  async getMessages(status?: string) {
    return this.prisma.contactMessage.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateMessageStatus(id: string, status: string, notes?: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
    });
  }

  async deleteMessage(id: string) {
    return this.prisma.contactMessage.delete({ where: { id } });
  }

  async getVolunteers(status?: string) {
    return this.prisma.volunteerApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateVolunteerStatus(id: string, status: string, notes?: string) {
    return this.prisma.volunteerApplication.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
    });
  }

  async deleteVolunteer(id: string) {
    return this.prisma.volunteerApplication.delete({ where: { id } });
  }

  // ==========================================
  // 5. TRASH & RESTORATION
  // ==========================================

  async getTrash() {
    const [
      team,
      certifications,
      videos,
      milestones,
      sevas,
      focusAreas,
      storyChapters,
      impactItems,
      donorBenefits,
      galleryItems,
      involveCards,
      faqs,
      announcements,
      media,
    ] = await Promise.all([
      this.prisma.teamMember.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.certification.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.video.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.milestone.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.seva.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.focusArea.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.storyChapter.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.impactItem.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.donorBenefit.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.galleryItem.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.involveCard.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.faqItem.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.announcement.findMany({ where: { deletedAt: { not: null } } }),
      this.prisma.mediaAsset.findMany({ where: { deletedAt: { not: null } } }),
    ]);

    return [
      ...team.map((i) => ({ ...i, entityType: 'team', displayTitle: i.nameEn })),
      ...certifications.map((i) => ({ ...i, entityType: 'certification', displayTitle: i.title })),
      ...videos.map((i) => ({ ...i, entityType: 'video', displayTitle: i.title })),
      ...milestones.map((i) => ({ ...i, entityType: 'milestone', displayTitle: `${i.year} - ${i.title}` })),
      ...sevas.map((i) => ({ ...i, entityType: 'seva', displayTitle: i.titleEn })),
      ...focusAreas.map((i) => ({ ...i, entityType: 'focus-area', displayTitle: i.titleEn })),
      ...storyChapters.map((i) => ({ ...i, entityType: 'story-chapter', displayTitle: `Chapter ${i.chapterNumber}: ${i.titleEn}` })),
      ...impactItems.map((i) => ({ ...i, entityType: 'impact-item', displayTitle: `₹${i.amount} - ${i.labelEn}` })),
      ...donorBenefits.map((i) => ({ ...i, entityType: 'donor-benefit', displayTitle: i.titleEn })),
      ...galleryItems.map((i) => ({ ...i, entityType: 'gallery-item', displayTitle: i.captionEn || i.imageUrl })),
      ...involveCards.map((i) => ({ ...i, entityType: 'involve-card', displayTitle: i.titleEn })),
      ...faqs.map((i) => ({ ...i, entityType: 'faq', displayTitle: i.questionEn })),
      ...announcements.map((i) => ({ ...i, entityType: 'announcement', displayTitle: i.titleEn })),
      ...media.map((i) => ({ ...i, entityType: 'media', displayTitle: i.originalName })),
    ];
  }

  async restoreTrashItem(entity: string, id: string) {
    const entityMap: Record<string, any> = {
      team: this.prisma.teamMember,
      certification: this.prisma.certification,
      video: this.prisma.video,
      milestone: this.prisma.milestone,
      seva: this.prisma.seva,
      'focus-area': this.prisma.focusArea,
      'story-chapter': this.prisma.storyChapter,
      'impact-item': this.prisma.impactItem,
      'donor-benefit': this.prisma.donorBenefit,
      'gallery-item': this.prisma.galleryItem,
      'involve-card': this.prisma.involveCard,
      faq: this.prisma.faqItem,
      announcement: this.prisma.announcement,
      media: this.prisma.mediaAsset,
    };

    const model = entityMap[entity];
    if (!model) throw new BadRequestException(`Invalid entity type for restore: ${entity}`);

    return model.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async permanentlyDeleteItem(entity: string, id: string) {
    // Safety boundary: never allow deletion of financial entities
    const forbidden = ['donation', 'receipt', 'donor', 'audit'];
    if (forbidden.includes(entity.toLowerCase())) {
      throw new BadRequestException('CANNOT_DELETE_FINANCIAL_RECORD: Financial records cannot be deleted.');
    }

    const entityMap: Record<string, any> = {
      team: this.prisma.teamMember,
      certification: this.prisma.certification,
      video: this.prisma.video,
      milestone: this.prisma.milestone,
      seva: this.prisma.seva,
      'focus-area': this.prisma.focusArea,
      'story-chapter': this.prisma.storyChapter,
      'impact-item': this.prisma.impactItem,
      'donor-benefit': this.prisma.donorBenefit,
      'gallery-item': this.prisma.galleryItem,
      'involve-card': this.prisma.involveCard,
      faq: this.prisma.faqItem,
      announcement: this.prisma.announcement,
      media: this.prisma.mediaAsset,
    };

    const model = entityMap[entity];
    if (!model) throw new BadRequestException(`Invalid entity type for permanent deletion: ${entity}`);

    return model.delete({ where: { id } });
  }
}
