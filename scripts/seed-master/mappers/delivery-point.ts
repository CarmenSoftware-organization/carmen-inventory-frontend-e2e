import type { Row, CreateDeliveryPointDto } from "../types";
import { toStr } from "./util";

export function mapDeliveryPoint(row: Row): CreateDeliveryPointDto {
  return {
    name: toStr(row["Description"], toStr(row["Code"])),
    is_active: true,
  };
}
