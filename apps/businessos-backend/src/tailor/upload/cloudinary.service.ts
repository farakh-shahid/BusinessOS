import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { randomUUID } from "crypto";
import {
  cloudinaryConfig,
  isCloudinaryConfigured,
} from "../../config/cloudinary.config";

const DRESS_PUBLIC_ID = "dress-color";

export type DressImageUploadContext = {
  tenantId: string;
  tenantSlug: string;
  orderId?: string;
  customerId?: string;
  draftKey?: string;
};

function slugifyTenantName(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "shop"
  );
}

@Injectable()
export class CloudinaryService {
  constructor() {
    if (isCloudinaryConfigured()) {
      cloudinary.config({
        cloud_name: cloudinaryConfig.cloudName,
        api_key: cloudinaryConfig.apiKey,
        api_secret: cloudinaryConfig.apiSecret,
        secure: true,
      });
    }
  }

  enabled(): boolean {
    return isCloudinaryConfigured();
  }

  slugifyTenantName(name: string): string {
    return slugifyTenantName(name);
  }

  buildFolderPath(context: DressImageUploadContext): string {
    const parts = [
      cloudinaryConfig.folderPrefix,
      context.tenantId,
      context.tenantSlug,
      "orders",
    ];

    if (context.orderId) {
      parts.push(context.orderId);
    } else if (context.customerId) {
      parts.push("drafts", context.customerId);
    } else {
      parts.push("drafts", "unsaved", context.draftKey ?? randomUUID());
    }

    return parts.join("/");
  }

  buildOrderFolderPath(
    tenantId: string,
    tenantSlug: string,
    orderId: string,
  ): string {
    return [cloudinaryConfig.folderPrefix, tenantId, tenantSlug, "orders", orderId].join(
      "/",
    );
  }

  async uploadDressImage(
    file: Express.Multer.File,
    context: DressImageUploadContext,
  ): Promise<{ url: string; publicId: string }> {
    const folder = this.buildFolderPath(context);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: DRESS_PUBLIC_ID,
          resource_type: "image",
          overwrite: true,
          invalidate: true,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(uploadResult);
        },
      );

      upload.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async promoteDraftToOrder(params: {
    tenantId: string;
    tenantName: string;
    orderId: string;
    currentPublicId: string;
  }): Promise<{ url: string; publicId: string } | null> {
    if (!this.enabled()) return null;

    const tenantSlug = slugifyTenantName(params.tenantName);
    const targetFolder = this.buildOrderFolderPath(
      params.tenantId,
      tenantSlug,
      params.orderId,
    );
    const targetPublicId = `${targetFolder}/${DRESS_PUBLIC_ID}`;

    if (params.currentPublicId === targetPublicId) {
      return {
        url: cloudinary.url(targetPublicId, { secure: true }),
        publicId: targetPublicId,
      };
    }

    try {
      const renamed = await cloudinary.uploader.rename(
        params.currentPublicId,
        targetPublicId,
        { overwrite: true, invalidate: true, resource_type: "image" },
      );

      return {
        url: renamed.secure_url,
        publicId: renamed.public_id,
      };
    } catch {
      return null;
    }
  }

  async deleteImage(publicId: string | null | undefined): Promise<void> {
    if (!this.enabled() || !publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });
    } catch {
      // Best-effort cleanup — order update should still succeed.
    }
  }
}
