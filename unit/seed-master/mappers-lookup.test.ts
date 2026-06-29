import { describe, it, expect } from "vitest";
import { mapCurrency } from "../../scripts/seed-master/mappers/currency";
import { mapUnit } from "../../scripts/seed-master/mappers/unit";
import { mapTaxProfile } from "../../scripts/seed-master/mappers/tax-profile";
import { mapDeliveryPoint } from "../../scripts/seed-master/mappers/delivery-point";
import { mapDepartment } from "../../scripts/seed-master/mappers/department";

describe("lookup mappers", () => {
  it("maps currency", () => {
    expect(mapCurrency({ Code: "THB", Name: "Thai baht", Symbol: "฿", "Exchange Rate": 1 })).toEqual({
      code: "THB", name: "Thai baht", symbol: "฿", exchange_rate: 1,
      description: "", decimal_places: 2, is_active: true,
    });
  });

  it("maps unit using Code as name (Unit has no code field)", () => {
    expect(mapUnit({ Code: "KG", Description: "Kilogram" })).toEqual({
      name: "KG", description: "Kilogram", is_active: true,
    });
  });

  it("maps tax profile using name identity", () => {
    expect(mapTaxProfile({ Name: "Vat 7%", Value: 7 })).toEqual({
      name: "Vat 7%", tax_rate: 7, is_active: true,
    });
  });

  it("maps delivery point using Description as name", () => {
    expect(mapDeliveryPoint({ Code: "MAIN", Description: "Main" })).toEqual({
      name: "Main", is_active: true,
    });
  });

  it("maps department with empty user transfer payloads", () => {
    expect(mapDepartment({ Code: 101, Description: "Front Office" })).toEqual({
      code: "101", name: "Front Office", description: "", is_active: true,
      department_users: { add: [], remove: [] },
      hod_users: { add: [], remove: [] },
    });
  });
});
