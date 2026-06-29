export const toStr = (v: unknown, fallback = ""): string =>
  v == null ? fallback : String(v).trim();

export const numOrNull = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

export const toBool = (v: unknown): boolean =>
  v === true || ["true", "1", "yes"].includes(String(v).trim().toLowerCase());
