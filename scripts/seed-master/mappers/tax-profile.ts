import type { Row, CreateTaxProfileDto } from "../types";
import { toStr } from "./util";

export function mapTaxProfile(row: Row): CreateTaxProfileDto {
  return {
    name: toStr(row["Name"]),
    tax_rate: Number(row["Value"] ?? 0) || 0,
    is_active: true,
  };
}
