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
        ? exception.meta.target.join(", ")
        : "record";
      const message =
        target.includes("phone")
          ? "A customer with this phone number already exists. Switch to Existing customer or use a different number."
          : "This record already exists. Please check your details and try again.";

      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: "Bad Request",
      });
      return;
    }

    this.logger.error(exception.message, exception.stack);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Something went wrong while saving. Please try again.",
      error: "Internal Server Error",
    });
  }
}
