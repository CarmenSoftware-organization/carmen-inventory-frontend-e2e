import { test } from "@playwright/test";

const skipList = ["TCS-UN00109", "TCS-UN00110"];
test("TC-UN-010001 list units", { annotation: [{ type: "preconditions", description: skipList.join(",") }] }, async () => {});
