import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator";
import { JwtAuthGuard } from "../../core/auth/jwt-auth.guard";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerFilterCountsQueryDto } from "./dto/customer-filter-counts-query.dto";
import { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
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

  @Get("lookup")
  lookup(
    @CurrentTenant() tenantId: string,
    @Query() query: SearchCustomersQueryDto,
  ) {
    return this.customers.lookup(tenantId, query.q);
  }

  @Get("by-phone")
  byPhone(@CurrentTenant() tenantId: string, @Query("phone") phone: string) {
    return this.customers.findByPhone(tenantId, phone);
  }

  @Get("filter-counts")
  filterCounts(
    @CurrentTenant() tenantId: string,
    @Query() query: CustomerFilterCountsQueryDto,
  ) {
    return this.customers.filterCounts(tenantId, query);
  }

  @Get()
  list(
    @CurrentTenant() tenantId: string,
    @Query() query: ListCustomersQueryDto,
  ) {
    return this.customers.list(tenantId, query);
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
