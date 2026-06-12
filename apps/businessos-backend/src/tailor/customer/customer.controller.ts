import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { SearchCustomersQueryDto } from "./dto/search-customers-query.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Controller("tailor/customers")
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customers: CustomerService) {}

  @Get("search")
  search(
    @CurrentTenant() tenantId: string,
    @Query() query: SearchCustomersQueryDto,
  ) {
    return this.customers.search(tenantId, query.q);
  }

  @Get()
  list(@CurrentTenant() tenantId: string) {
    return this.customers.list(tenantId);
  }

  @Get(":id")
  getById(@CurrentTenant() tenantId: string, @Param("id") id: string) {
    return this.customers.getById(tenantId, id);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateCustomerDto) {
    return this.customers.create(tenantId, dto);
  }

  @Patch(":id")
  update(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customers.update(tenantId, id, dto);
  }
}
