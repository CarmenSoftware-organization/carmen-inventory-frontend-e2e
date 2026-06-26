import { faker, fakerTH } from "@faker-js/faker";

/**
 * Run-scoped unique token. Evaluated once per worker process at import time —
 * identical semantics to the previous per-spec `const UID = Date.now().toString(36)`.
 * Keeps names/codes unique ACROSS runs (a re-run gets a fresh Date.now()) and
 * stable WITHIN a run, including after a Playwright worker restart (the module
 * re-imports and recomputes). Faker is intentionally NOT seeded; uniqueness
 * comes from this suffix, not from faker.
 */
export const uid = Date.now().toString(36);

/** Short uppercase token derived from `uid`, for use inside ASCII codes. */
export function shortUid(): string {
  return uid.slice(-4).toUpperCase();
}

type Locale = "en" | "th";

function fakerFor(locale: Locale = "en") {
  return locale === "th" ? fakerTH : faker;
}

export interface NameOptions {
  /** Per-test label kept for traceability (e.g. a TC tag). */
  tag?: string;
  locale?: Locale;
}

export interface EntityOptions {
  /**
   * Code prefix; keep <= 6 chars so `${prefix}${shortUid()}` stays within the
   * 10-char code maxLength enforced by config forms.
   */
  codePrefix?: string;
  tag?: string;
  locale?: Locale;
}

/**
 * Realistic ASCII code: `${prefix}${shortUid()}`, e.g. "E2E1A2B".
 * Faker does not help with constrained codes — this centralizes the proven
 * short/uppercase format. Callers pass a per-test prefix to keep records
 * distinct. Prefix MUST be <= 6 chars (code maxLength is 10).
 */
export function fakeCode(prefix = "E2E"): string {
  return `${prefix}${shortUid()}`;
}

/**
 * Realistic human-readable name: a faker company name plus the optional `tag`
 * and the run suffix, e.g. "Hessel and Sons DEP010010 E2E-1a2b3c".
 * The suffix guarantees cross-run uniqueness; `tag` keeps per-test traceability.
 */
export function fakeName(opts: NameOptions = {}): string {
  const f = fakerFor(opts.locale);
  const base = f.company.name();
  return [base, opts.tag, `E2E-${uid}`].filter(Boolean).join(" ");
}

/**
 * Realistic description sentence plus the run suffix. A faker lorem sentence is
 * well under the 256-char maxLength config description fields enforce.
 */
export function fakeDescription(opts: { locale?: Locale } = {}): string {
  const f = fakerFor(opts.locale);
  return `${f.lorem.sentence()} E2E-${uid}`;
}

/**
 * The data bundle a CRUD spec's top-of-file consts need. `name` and
 * `nameUpdated` are independent faker values (always distinct); both carry the
 * `tag` and run suffix.
 */
export function buildEntity(opts: EntityOptions = {}): {
  code: string;
  name: string;
  nameUpdated: string;
  description: string;
} {
  const { codePrefix = "E2E", tag, locale } = opts;
  return {
    code: fakeCode(codePrefix),
    name: fakeName({ tag, locale }),
    nameUpdated: fakeName({ tag: tag ? `${tag} Upd` : "Upd", locale }),
    description: fakeDescription({ locale }),
  };
}
