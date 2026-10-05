/**
 * Accounts of the movement suite (opt-in projects `movement` and `period-close`).
 *
 * These are NOT the gmail `TEST_USERS` of the rest of the suite: they live on the
 * CARMEN-AVG / CARMEN-FIFO business units, whose workflows, locations and products
 * were set up for inventory-movement testing (stock in/out, cost layers, period
 * close). Permissions as surveyed on 2026-10-02:
 *  - requestor — creates PR ("general item" workflow) / PO / SR; GRN + CN permission;
 *    locations LCX013 (52 products) and 1FO02 on CARMEN-AVG
 *  - hod       — approves SR / PR (stage "หัวหน้าแผนก" / HOD)
 *  - fc        — the only account with Stock In / Stock Out permission; location 1FO02;
 *    sits in the "Issue" stage of the SR workflow
 *  - admin     — period close and setup scripts only; it is in no workflow's
 *    "Create Request" stage and bypasses permission checks, so doc-flow specs avoid it
 */
export const MOVEMENT_USERS = {
  admin: { email: "admin@carmen.com", password: "P@ssw0rd" },
  requestor: { email: "requestor@carmen.com", password: "P@ssw0rd" },
  purchase: { email: "purchase@carmen.com", password: "P@ssw0rd" },
  hod: { email: "hod@carmen.com", password: "P@ssw0rd" },
  fc: { email: "fc@carmen.com", password: "P@ssw0rd" },
} as const;

export type MovementUser = keyof typeof MOVEMENT_USERS;
