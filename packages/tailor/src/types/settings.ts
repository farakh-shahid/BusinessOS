export interface TenantSettings {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsappFooter?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "ADMIN" | "STAFF" | "TAILOR";
  specialty?: string;
  createdAt: string;
}
