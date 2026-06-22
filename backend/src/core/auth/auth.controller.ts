import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import type { AuthUser } from "../../common/types/auth-user.type";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.auth.updateProfile(user.id, dto);
  }
}
