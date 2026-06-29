import type { Row, CreateLocationDto, InventoryType, PhysicalCountType } from "../types";
import { toStr } from "./util";

const INVENTORY_TYPES: InventoryType[] = ["inventory", "direct", "consignment"];

function normalizeLocationType(v: unknown): InventoryType {
  const s = toStr(v).toLowerCase();
  return (INVENTORY_TYPES as string[]).includes(s) ? (s as InventoryType) : "inventory";
}

function normalizePhysicalCount(v: unknown): PhysicalCountType {
  return toStr(v).toLowerCase() === "yes" ? "yes" : "no";
}

export function mapStoreLocation(row: Row, dpIdByName: Map<string, string>): CreateLocationDto {
  const dpName = toStr(row["Delivery Point"]);
  const dpId = dpIdByName.get(dpName);
  return {
    code: toStr(row["Store Code"]),
    name: toStr(row["Store Name"]),
    location_type: normalizeLocationType(row["location Type"]),
    physical_count_type: normalizePhysicalCount(row["Physical Counted type"]),
    description: "",
    is_active: true,
    ...(dpId ? { delivery_point_id: dpId } : {}),
    delivery_point_name: dpName,
    users: { add: [], remove: [] },
    products: { add: [], remove: [] },
  };
}
