import { test } from "@playwright/test";

test("TC-UN-010001 list units", async () => {});
test("TC-UN-010002 view detail", { annotation: [{ type: "preconditions", description: "TC-UN-010001 ผ่านแล้ว" }] }, async () => {});
test("TC-UN-010003 create unit", { annotation: [{ type: "preconditions", description: "TC-UN-010001 และ TC-UN-010002 ผ่านแล้ว" }] }, async () => {});
