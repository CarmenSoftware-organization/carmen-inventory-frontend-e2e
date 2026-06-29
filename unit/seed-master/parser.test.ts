// unit/seed-master/parser.test.ts
import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { extractRows } from "../../scripts/seed-master/parser";

function makeWorkbook(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const sheets: Record<string, unknown[][]> = {
    "Company Profile": [["BU Code"], ["CARMEN-AVG"]],
    Currency: [["Code", "Name", "Symbol", "Exchange Rate"], ["THB", "Thai baht", "฿", 1]],
    Unit: [["Code", "Description"], ["KG", "KG"], ["BAG", "BAG"]],
    "Tax Profile": [["Name", "Value"], ["None", 0], ["Vat 7%", 7]],
    "Item Group": [
      ["Category Code", "Category Description", "Subcategory Code", "Subcategory Description", "Item Group Code", "Item Group Description"],
      [1, "FOOD", 10, "DRY FOOD", 1100, "SAUCE & SEASONING"],
    ],
    "Product list": [["Product Code", "Description (Eng)"], [11110001, "Ground Beef "]],
    "Delivery Point": [["Code", "Description"], ["MAIN", "Main"]],
    "Store Location": [["Store Code", "Store Name", "Delivery Point", "location Type", "Physical Counted type"], ["1AG01", "A&G", "Main", "inventory", "yes"]],
    Department: [["Code", "Description"], [101, "Rooms General Account"]],
    Vendor: [["code", "name", "active"], ["N016", "Acme", true]],
  };
  for (const [name, aoa] of Object.entries(sheets)) {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name);
  }
  return wb;
}

describe("extractRows", () => {
  it("maps each sheet to keyed rows", () => {
    const rows = extractRows(makeWorkbook());
    expect(rows.currency).toEqual([{ Code: "THB", Name: "Thai baht", Symbol: "฿", "Exchange Rate": 1 }]);
    expect(rows.unit).toHaveLength(2);
    expect(rows.unit[0].Code).toBe("KG");
    expect(rows.department[0]["Description"]).toBe("Rooms General Account");
    expect(rows.product[0]["Product Code"]).toBe(11110001);
    expect(rows.storeLocation[0]["Physical Counted type"]).toBe("yes");
  });

  it("throws when a required sheet is missing", () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["x"]]), "Currency");
    expect(() => extractRows(wb)).toThrow(/Missing sheet "Unit"/);
  });
});
