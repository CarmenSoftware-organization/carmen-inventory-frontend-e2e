import type { Row, CreateDepartmentDto } from "../types";
import { toStr } from "./util";

export function mapDepartment(row: Row): CreateDepartmentDto {
  return {
    code: toStr(row["Code"]),
    name: toStr(row["Description"]),
    description: "",
    is_active: true,
    department_users: { add: [], remove: [] },
    hod_users: { add: [], remove: [] },
  };
}
