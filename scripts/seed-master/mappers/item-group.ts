import type { Row, ItemGroupTree, CreateCategoryDto, PlannedSubCategory, PlannedItemGroup } from "../types";
import { toStr } from "./util";

export function buildItemGroupTree(rows: Row[]): ItemGroupTree {
  const categories = new Map<string, CreateCategoryDto>();
  const subcategories = new Map<string, PlannedSubCategory>();
  const itemGroups = new Map<string, PlannedItemGroup>();

  for (const row of rows) {
    const catCode = toStr(row["Category Code"]);
    const subCode = toStr(row["Subcategory Code"]);
    const igCode = toStr(row["Item Group Code"]);

    if (catCode && !categories.has(catCode)) {
      categories.set(catCode, {
        code: catCode,
        name: toStr(row["Category Description"], catCode),
        is_active: true,
      });
    }
    if (subCode && !subcategories.has(subCode)) {
      subcategories.set(subCode, {
        code: subCode,
        name: toStr(row["Subcategory Description"], subCode),
        parentCategoryCode: catCode,
      });
    }
    if (igCode && !itemGroups.has(igCode)) {
      itemGroups.set(igCode, {
        code: igCode,
        name: toStr(row["Item Group Description"], igCode),
        parentSubCategoryCode: subCode,
      });
    }
  }

  return {
    categories: [...categories.values()],
    subcategories: [...subcategories.values()],
    itemGroups: [...itemGroups.values()],
  };
}
