import { describe, it, expect } from "vitest";
import { buildItemGroupTree } from "../../scripts/seed-master/mappers/item-group";

const rows = [
  { "Category Code": 1, "Category Description": "FOOD", "Subcategory Code": 10, "Subcategory Description": "DRY FOOD", "Item Group Code": 1100, "Item Group Description": "SAUCE & SEASONING" },
  { "Category Code": 1, "Category Description": "FOOD", "Subcategory Code": 10, "Subcategory Description": "DRY FOOD", "Item Group Code": 1101, "Item Group Description": "FOOD CAN & PICKLES" },
  { "Category Code": 2, "Category Description": "BEVERAGE", "Subcategory Code": 20, "Subcategory Description": "SOFT DRINK", "Item Group Code": 2000, "Item Group Description": "SODA" },
];

describe("buildItemGroupTree", () => {
  it("de-duplicates categories and subcategories and stringifies codes", () => {
    const tree = buildItemGroupTree(rows);
    expect(tree.categories).toEqual([
      { code: "1", name: "FOOD", is_active: true },
      { code: "2", name: "BEVERAGE", is_active: true },
    ]);
    expect(tree.subcategories).toEqual([
      { code: "10", name: "DRY FOOD", parentCategoryCode: "1" },
      { code: "20", name: "SOFT DRINK", parentCategoryCode: "2" },
    ]);
    expect(tree.itemGroups).toEqual([
      { code: "1100", name: "SAUCE & SEASONING", parentSubCategoryCode: "10" },
      { code: "1101", name: "FOOD CAN & PICKLES", parentSubCategoryCode: "10" },
      { code: "2000", name: "SODA", parentSubCategoryCode: "20" },
    ]);
  });
});
