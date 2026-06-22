import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === "P1001" || exception.code === "P1002" || exception.code === "P1017") {
      this.logger.error(
        `Database connection failed (${exception.code}): ${exception.message}`,
      );
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message:
          "Cannot reach the database. Check DATABASE_URL and your network connection.",
        error: "Service Unavailable",
      });
      return;
    }

    if (exception.code === "P2020") {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          "One or more measurements are out of range. Use inches with decimals (e.g. 34.5). Each value must be between 0 and 999.",
        error: "Bad Request",
      });
      return;
    }

    if (exception.code === "P2002") {
      const target = Array.isArray(exception.meta?.target)
        ? exception.meta.target.join(",")
        : String(exception.meta?.target ?? "record");

      let message =
        "This record already exists. Please check your details and try again.";

      if (target.includes("tenant_id") && target.includes("phone")) {
        message =
          "A customer with this phone number already exists in your shop. Switch to Existing customer or use a different number.";
      } else if (target.includes("users_phone") || target === "phone") {
        message =
          "This phone number is already registered for another staff login.";
      } else if (target.includes("users_email") || target === "email") {
        message =
          "This email is already registered for another staff login.";
      } else if (target.includes("phone")) {
        message =
          "A customer with this phone number already exists in your shop. Switch to Existing customer or use a different number.";
      }

      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: "Bad Request",
      });
      return;
    }

    this.logger.error(
      `${exception.code ?? "PRISMA"}: ${exception.message}`,
      exception.stack,
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Something went wrong while saving. Please try again.",
      error: "Internal Server Error",
    });
  }
}
