import type { Row, CreateUnitDto } from "../types";
import { toStr } from "./util";

export function mapUnit(row: Row): CreateUnitDto {
  const name = toStr(row["Code"]);
  return {
    name,
    description: toStr(row["Description"], name),
    is_active: true,
  };
}
