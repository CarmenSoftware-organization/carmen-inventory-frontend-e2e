import type { Row, CreateProductDto } from "../types";
import { toStr, numOrNull } from "./util";

export interface ProductLookups {
  unitIdByName: Map<string, string>;
  itemGroupIdByCode: Map<string, string>;
  taxIdByName: Map<string, string>;
}

export function mapProduct(row: Row, maps: ProductLookups): CreateProductDto | null {
  const inventory_unit_id = maps.unitIdByName.get(toStr(row["Inventory Unit"]));
  const product_item_group_id = maps.itemGroupIdByCode.get(toStr(row["Item Group"]));
  if (!inventory_unit_id || !product_item_group_id) return null;

  const tax_profile_id = maps.taxIdByName.get(toStr(row["Tax profile"]).toLowerCase()) ?? null;

  return {
    code: toStr(row["Product Code"]),
    name: toStr(row["Description (Eng)"]),
    local_name: toStr(row["Description (Local)"]),
    description: "",
    inventory_unit_id,
    product_item_group_id,
    product_status_type: "active",
    tax_profile_id,
    price_deviation_limit: numOrNull(row["(%) Price Deviation"]),
    qty_deviation_limit: numOrNull(row["(%) Qty Deviation"]),
    product_info: {
      is_used_in_recipe: false,
      is_sold_directly: false,
      barcode: toStr(row["Bar code"]),
      sku: "",
      price: numOrNull(row["Standard cost"]),
      info: [],
    },
  };
}
