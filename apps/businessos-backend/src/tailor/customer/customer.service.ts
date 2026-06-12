import { Injectable } from "@nestjs/common";
import { CustomerRepository } from "./customer.repository";
import type { CreateCustomerDto } from "./dto/create-customer.dto";
import type { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomerService {
  constructor(private readonly customers: CustomerRepository) {}

  list(tenantId: string) {
    return this.customers.listByTenant(tenantId);
  }

  search(tenantId: string, query: string) {
    return this.customers.search(tenantId, query);
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
