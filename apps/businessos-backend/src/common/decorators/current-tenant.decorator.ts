import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from "@nestjs/common";
import type { AuthUser } from "../types/auth-user.type";

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    const tenantId = request.user?.tenantId;

    if (!tenantId) {
      throw new BadRequestException("Tenant context is required");
    }

    return tenantId;
  },
);
