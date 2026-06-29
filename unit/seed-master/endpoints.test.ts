import { describe, it, expect } from "vitest";
import { ENDPOINTS, ALL_ENTITIES } from "../../scripts/seed-master/types";

describe("ENDPOINTS", () => {
  it("builds real backend config paths (no /api/proxy prefix)", () => {
    expect(ENDPOINTS.currencies("BLAVG")).toBe("/api/config/BLAVG/currencies");
    expect(ENDPOINTS.units("BLAVG")).toBe("/api/config/BLAVG/units");
    expect(ENDPOINTS.taxProfiles("BLAVG")).toBe("/api/config/BLAVG/tax-profiles");
    expect(ENDPOINTS.deliveryPoints("BLAVG")).toBe("/api/config/BLAVG/delivery-points");
    expect(ENDPOINTS.departments("BLAVG")).toBe("/api/config/BLAVG/departments");
    expect(ENDPOINTS.locations("BLAVG")).toBe("/api/config/BLAVG/locations");
    expect(ENDPOINTS.productCategories("BLAVG")).toBe("/api/config/BLAVG/product-categories");
    expect(ENDPOINTS.productSubCategories("BLAVG")).toBe("/api/config/BLAVG/product-sub-categories");
    expect(ENDPOINTS.productItemGroups("BLAVG")).toBe("/api/config/BLAVG/product-item-groups");
    expect(ENDPOINTS.vendors("BLAVG")).toBe("/api/config/BLAVG/vendors");
    expect(ENDPOINTS.products("BLAVG")).toBe("/api/config/BLAVG/products");
  });

  it("lists all nine seedable entity names", () => {
    expect(ALL_ENTITIES).toEqual([
      "currency", "unit", "tax-profile", "delivery-point", "department",
      "store-location", "item-group", "vendor", "product",
    ]);
  });
});
