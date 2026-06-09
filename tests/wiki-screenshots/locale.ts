import type { BrowserContext } from "@playwright/test";

/** Force the frontend into English by setting the next-intl NEXT_LOCALE cookie. */
export async function setEnLocale(
  context: BrowserContext,
  baseURL: string,
): Promise<void> {
  const { hostname } = new URL(baseURL);
  await context.addCookies([
    { name: "NEXT_LOCALE", value: "en", domain: hostname, path: "/" },
  ]);
}
