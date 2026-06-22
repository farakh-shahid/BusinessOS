import {
  BadRequestException,
  Controller,
  Post,
  Query,
  ServiceUnavailableException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { PrismaService } from "../../core/database/prisma.service";
import { isCloudinaryConfigured } from "../../config/cloudinary.config";
import { CloudinaryService } from "./cloudinary.service";
import { UploadDressImageQueryDto } from "./dto/upload-dress-image-query.dto";

const MAX_IMAGE_BYTES = 5_000_000;

@Controller("tailor/uploads")
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  @Post("dress-image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          cb(new BadRequestException("Only image files allowed"), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadDressImage(
    @CurrentTenant() tenantId: string,
    @Query() query: UploadDressImageQueryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!isCloudinaryConfigured()) {
      throw new ServiceUnavailableException(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      );
    }

    if (!file?.buffer) {
      throw new BadRequestException("No file uploaded");
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true },
    });

    if (!tenant) {
      throw new BadRequestException("Tenant not found");
    }

    if (query.customerId) {
      await this.assertCustomer(tenantId, query.customerId);
    }

    if (query.orderId) {
      await this.assertOrder(tenantId, query.orderId);
    }

    const tenantSlug = this.cloudinary.slugifyTenantName(tenant.name);

    const uploaded = await this.cloudinary.uploadDressImage(file, {
      tenantId,
      tenantSlug,
      orderId: query.orderId,
      customerId: query.customerId,
      draftKey: query.draftKey,
    });

    return {
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  }

  private async assertCustomer(tenantId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId },
      select: { id: true },
    });

    if (!customer) {
      throw new BadRequestException("Customer not found");
    }
  }

  private async assertOrder(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, tenantId },
      select: { id: true },
    });

    if (!order) {
      throw new BadRequestException("Order not found");
    }
  }
}
