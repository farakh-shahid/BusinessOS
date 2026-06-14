import { Injectable } from "@nestjs/common";
import { CustomerRepository } from "./customer.repository";
import type { CreateCustomerDto } from "./dto/create-customer.dto";
import type { ListCustomersQueryDto } from "./dto/list-customers-query.dto";
import type { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomerService {
  constructor(private readonly customers: CustomerRepository) {}

  list(tenantId: string, query?: ListCustomersQueryDto) {
    return this.customers.listByTenant(tenantId, query);
  }

  search(tenantId: string, query: string) {
    return this.customers.search(tenantId, query);
  }

  lookup(tenantId: string, query: string) {
    return this.customers.lookup(tenantId, query);
  }

  findByPhone(tenantId: string, phone: string) {
    return this.customers.findByPhone(tenantId, phone);
  }

  getById(tenantId: string, id: string) {
    return this.customers.getDetail(tenantId, id);
  }

  create(tenantId: string, dto: CreateCustomerDto) {
    return this.customers.create(tenantId, dto);
  }

  update(tenantId: string, id: string, dto: UpdateCustomerDto) {
    return this.customers.update(tenantId, id, dto);
  }
}
