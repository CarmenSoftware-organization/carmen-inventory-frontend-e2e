export const TEST_USERS = [
  { role: "Requestor", email: "requestor@zebra.com", password: "12345678" },
  { role: "HOD", email: "hod@zebra.com", password: "12345678" },
  { role: "Purchase", email: "purchase@zebra.com", password: "12345678" },
  { role: "FC", email: "fc@zebra.com", password: "12345678" },
  { role: "GM", email: "gm@zebra.com", password: "12345678" },
  { role: "Owner", email: "owner@zebra.com", password: "12345678" },
] as const;

/** Default password used by most test users — kept for backward compatibility. */
export const TEST_PASSWORD = "12345678";

/** Look up the password for a given test user email. */
export function getPasswordFor(email: string): string {
  return TEST_USERS.find((u) => u.email === email)?.password ?? TEST_PASSWORD;
}
export const BU_CODE = "T02";
