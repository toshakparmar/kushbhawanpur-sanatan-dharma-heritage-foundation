import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@kushbhawanpur/shared';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // 1. Page Sections
  @Get('sections')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async getSections() {
    return this.cmsService.getSections();
  }

  @Get('sections/:key')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async getSection(@Param('key') key: string) {
    return this.cmsService.getSection(key);
  }

  @Put('sections/:key')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async updateSection(
    @Param('key') key: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.cmsService.updateSectionDraft(key, dto, req.user?.email);
  }

  @Post('sections/:key/publish')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async publishSection(@Param('key') key: string, @Req() req: any) {
    return this.cmsService.publishSection(key, req.user?.email);
  }

  @Post('sections/:key/revert')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async revertSection(@Param('key') key: string) {
    return this.cmsService.revertSection(key);
  }

  @Get('sections/:key/versions')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async getSectionVersions(@Param('key') key: string) {
    return this.cmsService.getSectionVersions(key);
  }

  @Post('sections/:key/versions/:id/restore')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async restoreSectionVersion(
    @Param('key') key: string,
    @Param('id') versionId: string,
  ) {
    return this.cmsService.restoreSectionVersion(key, versionId);
  }

  @Patch('sections/reorder')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async reorderSections(@Body() items: { key: string; sortOrder: number }[]) {
    return this.cmsService.reorderSections(items);
  }

  // 2. Relational repeating items
  @Get('website/items/:entity')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async getItems(@Param('entity') entity: string) {
    return this.cmsService.getItems(entity);
  }

  @Post('website/items/:entity')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async createItem(@Param('entity') entity: string, @Body() dto: any) {
    return this.cmsService.createItem(entity, dto);
  }

  @Patch('website/items/:entity/:id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async updateItem(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.cmsService.updateItem(entity, id, dto);
  }

  @Delete('website/items/:entity/:id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async deleteItem(@Param('entity') entity: string, @Param('id') id: string) {
    return this.cmsService.deleteItem(entity, id);
  }

  @Patch('website/items/:entity/reorder')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async reorderItems(
    @Param('entity') entity: string,
    @Body() items: { id: string; sortOrder: number }[],
  ) {
    return this.cmsService.reorderItems(entity, items);
  }

  // 3. Site Settings & Policies
  @Get('site-settings')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async getSiteSettings() {
    return this.cmsService.getSiteSettings();
  }

  @Put('site-settings')
  @Roles(Role.SUPER_ADMIN)
  async updateSiteSettings(@Body() dto: any) {
    return this.cmsService.updateSiteSettings(dto);
  }

  @Get('policies')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async getPolicies() {
    return this.cmsService.getPolicies();
  }

  @Get('policies/:slug')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async getPolicy(@Param('slug') slug: string) {
    return this.cmsService.getPolicy(slug);
  }

  @Put('policies/:slug')
  @Roles(Role.SUPER_ADMIN)
  async updatePolicy(@Param('slug') slug: string, @Body() dto: any) {
    return this.cmsService.updatePolicy(slug, dto);
  }

  // 4. Inbox
  @Get('inbox/messages')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async getMessages(@Query('status') status?: string) {
    return this.cmsService.getMessages(status);
  }

  @Patch('inbox/messages/:id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async updateMessageStatus(
    @Param('id') id: string,
    @Body() dto: { status: string; notes?: string },
  ) {
    return this.cmsService.updateMessageStatus(id, dto.status, dto.notes);
  }

  @Delete('inbox/messages/:id')
  @Roles(Role.SUPER_ADMIN)
  async deleteMessage(@Param('id') id: string) {
    return this.cmsService.deleteMessage(id);
  }

  @Get('inbox/volunteers')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT, Role.ACCOUNTS)
  async getVolunteers(@Query('status') status?: string) {
    return this.cmsService.getVolunteers(status);
  }

  @Patch('inbox/volunteers/:id')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async updateVolunteerStatus(
    @Param('id') id: string,
    @Body() dto: { status: string; notes?: string },
  ) {
    return this.cmsService.updateVolunteerStatus(id, dto.status, dto.notes);
  }

  @Delete('inbox/volunteers/:id')
  @Roles(Role.SUPER_ADMIN)
  async deleteVolunteer(@Param('id') id: string) {
    return this.cmsService.deleteVolunteer(id);
  }

  // 5. Trash & Restore
  @Get('trash')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async getTrash() {
    return this.cmsService.getTrash();
  }

  @Post('trash/:entity/:id/restore')
  @Roles(Role.SUPER_ADMIN, Role.CONTENT)
  async restoreTrashItem(
    @Param('entity') entity: string,
    @Param('id') id: string,
  ) {
    return this.cmsService.restoreTrashItem(entity, id);
  }

  @Delete('trash/:entity/:id')
  @Roles(Role.SUPER_ADMIN)
  async permanentlyDelete(
    @Param('entity') entity: string,
    @Param('id') id: string,
  ) {
    return this.cmsService.permanentlyDeleteItem(entity, id);
  }
}
