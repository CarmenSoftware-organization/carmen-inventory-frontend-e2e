import { describe, it, expect } from "vitest";
import { mapStoreLocation } from "../../scripts/seed-master/mappers/store-location";

describe("mapStoreLocation", () => {
  const dpMap = new Map([["Main", "dp-uuid-1"]]);

  it("maps a store location and resolves delivery_point_id by name", () => {
    expect(
      mapStoreLocation(
        { "Store Code": "1AG01", "Store Name": "A&G-Accounting", "Delivery Point": "Main", "location Type": "inventory", "Physical Counted type": "yes" },
        dpMap,
      ),
    ).toEqual({
      code: "1AG01",
      name: "A&G-Accounting",
      location_type: "inventory",
      physical_count_type: "yes",
      description: "",
      is_active: true,
      delivery_point_id: "dp-uuid-1",
      delivery_point_name: "Main",
      users: { add: [], remove: [] },
      products: { add: [], remove: [] },
    });
  });

  it("defaults unknown location type to inventory and physical count to no; omits id when DP unknown", () => {
    const dto = mapStoreLocation(
      { "Store Code": "X1", "Store Name": "X", "Delivery Point": "Other", "location Type": "weird", "Physical Counted type": "maybe" },
      dpMap,
    );
    expect(dto.location_type).toBe("inventory");
    expect(dto.physical_count_type).toBe("no");
    expect(dto.delivery_point_id).toBeUndefined();
    expect(dto.delivery_point_name).toBe("Other");
  });
});
