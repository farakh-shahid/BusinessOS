import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { mkdirSync } from "fs";
import { randomUUID } from "crypto";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";

const uploadRoot = join(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  "uploads",
  "dress-images",
);

try {
  mkdirSync(uploadRoot, { recursive: true });
} catch {
  // Vercel lambdas use a read-only filesystem outside /tmp
}

@Controller("tailor/uploads")
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post("dress-image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: uploadRoot,
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname) || ".jpg"}`);
        },
      }),
      limits: { fileSize: 500_000 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          cb(new BadRequestException("Only image files allowed"), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadDressImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    return {
      url: `/api/uploads/dress-images/${file.filename}`,
    };
  }
}
