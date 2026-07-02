import type { TCustomer } from "@/types";
import { dollarsToCents } from "@/lib/money";

// Hashes generated at bcrypt cost factor 12.
// Regenerate: node -e "const b=require('bcryptjs');console.log(b.hashSync('Password1!',12))"
const CUSTOMERS: TCustomer[] = [
  {
    id: "cust_01",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    passwordHash: "$2a$12$5hmTf3fHcrFub2IqoTzfGOF3GggpxKQ5iRk4mRIz3Ron/DKj2jFfO",
    plan: {
      planName: "Plus",
      planTier: "plus",
      renewalDate: "2026-07-15",
      monthlyCostAUD: dollarsToCents(65),
      status: "active",
    },
  },
  {
    id: "cust_02",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    passwordHash: "$2a$12$smAS7Ucgmo1rHsKpvsHtUuzpT99ElzBJXs/LDU7h//4stuaz0/8M6",
    plan: {
      planName: "Starter",
      planTier: "starter",
      renewalDate: "2026-07-20",
      monthlyCostAUD: dollarsToCents(39),
      status: "active",
    },
  },
];

export async function findCustomerByEmail(email: string): Promise<TCustomer | null> {
  return CUSTOMERS.find((c) => c.email === email.toLowerCase()) ?? null;
}

export async function findCustomerById(id: string): Promise<TCustomer | null> {
  return CUSTOMERS.find((c) => c.id === id) ?? null;
}
