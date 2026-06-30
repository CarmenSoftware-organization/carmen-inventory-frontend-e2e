import type { Row, CreateVendorDto } from "../types";
import { toStr, toBool } from "./util";

export function mapVendor(row: Row): CreateVendorDto {
  const line1 = toStr(row["address_line1"]);
  const phone = toStr(row["telephone"]);
  const email = toStr(row["email"]);
  const payee = toStr(row["payee"], toStr(row["name"]));

  return {
    code: toStr(row["code"]),
    name: toStr(row["name"]),
    description: "",
    is_active: toBool(row["active"]),
    business_type: [],
    info: [],
    vendor_address: {
      add: line1
        ? [{
            // Backend enum_vendor_address_type = contact_address | mailing_address
            // | register_address; "main" was rejected with a 400. contact_address
            // is what the backend's own vendor seed data uses as the primary entry.
            address_type: "contact_address",
            address_line1: line1,
            address_line2: toStr(row["address_line2"]),
            city: toStr(row["city"]),
            district: "",
            sub_district: "",
            province: toStr(row["province"]),
            postal_code: toStr(row["postal_code"]),
            country: toStr(row["country"]),
          }]
        : [],
    },
    vendor_contact: {
      add: phone || email
        ? [{ name: payee, email, phone, is_primary: true }]
        : [],
    },
  };
}
