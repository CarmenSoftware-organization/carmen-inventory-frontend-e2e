import { describe, it, expect } from "vitest";
import { mapVendor } from "../../scripts/seed-master/mappers/vendor";

describe("mapVendor", () => {
  it("maps code/name/active plus one address and contact when present", () => {
    const dto = mapVendor({
      code: "A030", name: "Advance Wireless", active: true, payee: "Advance Wireless Co",
      address_line1: 414, address_line2: "Phaholyothin Rd", city: "Bangkok",
      province: "Bangkok", postal_code: "10400", country: "THAILAND",
      telephone: "02-0293665", email: "ar@adv.co",
    });
    expect(dto.code).toBe("A030");
    expect(dto.name).toBe("Advance Wireless");
    expect(dto.is_active).toBe(true);
    expect(dto.business_type).toEqual([]);
    expect(dto.info).toEqual([]);
    expect(dto.vendor_address.add).toEqual([{
      address_type: "contact_address", address_line1: "414", address_line2: "Phaholyothin Rd",
      city: "Bangkok", district: "", sub_district: "", province: "Bangkok",
      postal_code: "10400", country: "THAILAND",
    }]);
    expect(dto.vendor_contact.add).toEqual([{
      name: "Advance Wireless Co", email: "ar@adv.co", phone: "02-0293665", is_primary: true,
    }]);
  });

  it("emits empty add arrays when address line and contact info are absent", () => {
    const dto = mapVendor({ code: "N016", name: "Narong", active: true, payee: null, address_line1: null, telephone: null, email: null });
    expect(dto.vendor_address.add).toEqual([]);
    expect(dto.vendor_contact.add).toEqual([]);
  });
});
