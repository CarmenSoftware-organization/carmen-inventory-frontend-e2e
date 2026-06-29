import { describe, it, expect } from "vitest";
import { mapProduct } from "../../scripts/seed-master/mappers/product";

const maps = {
  unitIdByName: new Map([["KG", "unit-kg"]]),
  itemGroupIdByCode: new Map([["1111", "ig-1111"]]),
  taxIdByName: new Map([["none", "tax-none"], ["vat 7%", "tax-vat7"]]),
};

describe("mapProduct", () => {
  it("maps a product and resolves unit/item-group/tax FKs", () => {
    const dto = mapProduct(
      { "Product Code": 11110001, "Description (Eng)": "Ground Beef ", "Description (Local)": "เนื้อบด", "Bar code": null, "Item Group": 1111, "Inventory Unit": "KG", "Tax profile": "none", "Standard cost": 0, "(%) Qty Deviation": 0, "(%) Price Deviation": 0 },
      maps,
    );
    expect(dto).not.toBeNull();
    expect(dto).toMatchObject({
      code: "11110001",
      name: "Ground Beef",
      local_name: "เนื้อบด",
      inventory_unit_id: "unit-kg",
      product_item_group_id: "ig-1111",
      product_status_type: "active",
      tax_profile_id: "tax-none",
      price_deviation_limit: 0,
      qty_deviation_limit: 0,
    });
    expect(dto!.product_info).toEqual({
      is_used_in_recipe: false, is_sold_directly: false, barcode: "", sku: "", price: 0, info: [],
    });
  });

  it("matches tax profile case-insensitively and null when unknown", () => {
    const dto = mapProduct({ "Product Code": "P2", "Description (Eng)": "X", "Item Group": 1111, "Inventory Unit": "KG", "Tax profile": "Vat 7%" }, maps);
    expect(dto!.tax_profile_id).toBe("tax-vat7");
    const dto2 = mapProduct({ "Product Code": "P3", "Description (Eng)": "Y", "Item Group": 1111, "Inventory Unit": "KG", "Tax profile": "unknown" }, maps);
    expect(dto2!.tax_profile_id).toBeNull();
  });

  it("returns null when inventory unit or item group cannot be resolved", () => {
    expect(mapProduct({ "Product Code": "P4", "Inventory Unit": "L", "Item Group": 1111 }, maps)).toBeNull();
    expect(mapProduct({ "Product Code": "P5", "Inventory Unit": "KG", "Item Group": 9999 }, maps)).toBeNull();
  });
});
