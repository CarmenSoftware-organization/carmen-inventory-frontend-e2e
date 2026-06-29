import type { Row, CreateCurrencyDto } from "../types";
import { toStr } from "./util";

export function mapCurrency(row: Row): CreateCurrencyDto {
  return {
    code: toStr(row["Code"]),
    name: toStr(row["Name"]),
    symbol: toStr(row["Symbol"]),
    exchange_rate: Number(row["Exchange Rate"] ?? 1) || 1,
    description: "",
    decimal_places: 2,
    is_active: true,
  };
}
