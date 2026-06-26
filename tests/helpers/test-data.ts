import { faker, fakerTH } from "@faker-js/faker";

/**
 * Run-scoped unique token. Evaluated once per worker process at import time —
 * identical semantics to the previous per-spec `const UID = Date.now().toString(36)`.
 * Stable within a worker process; recomputed fresh (new value) when the worker
 * restarts and the module re-imports. Keeps names/codes unique across runs.
 * Faker is intentionally NOT seeded; uniqueness comes from this suffix, not from faker.
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

interface NameOptions {
  /** Per-test label kept for traceability (e.g. a TC tag). */
  tag?: string;
  locale?: Locale;
  /**
   * Optional cap on the returned length. Only the faker base is trimmed to
   * fit — the `tag` and run suffix are load-bearing (traceability +
   * uniqueness) and never truncated. Must be >= length of `tag` + suffix.
   */
  maxLength?: number;
}

interface EntityOptions {
  /**
   * Code prefix; keep <= 6 chars so `${prefix}${shortUid()}` stays within the
   * 10-char code maxLength enforced by config forms.
   */
  codePrefix?: string;
  tag?: string;
  locale?: Locale;
  /** Optional cap forwarded as `maxLength` to both `name` and `nameUpdated`. */
  nameMaxLength?: number;
}

/**
 * Realistic ASCII code: `${prefix}${shortUid()}`, e.g. "E2E1A2B".
 * Faker does not help with constrained codes — this centralizes the proven
 * short/uppercase format. Callers pass a per-test prefix to keep records
 * distinct. Prefix MUST be <= 6 chars (code maxLength is 10); a longer prefix
 * throws rather than silently producing a code the form would truncate.
 */
export function fakeCode(prefix = "E2E"): string {
  if (prefix.length > 6) {
    throw new Error(
      `fakeCode prefix "${prefix}" is ${prefix.length} chars; must be <= 6 so ` +
        `the code stays within the 10-char maxLength.`,
    );
  }
  return `${prefix}${shortUid()}`;
}

/**
 * Realistic human-readable name: a faker company name plus the optional `tag`
 * and the run suffix, e.g. "Hessel and Sons DEP010010 E2E-1a2b3c".
 * The suffix guarantees cross-run uniqueness; `tag` keeps per-test traceability.
 * When `maxLength` is set, only the faker base is trimmed to fit — the tag and
 * suffix are preserved so uniqueness/traceability survive the cap.
 */
export function fakeName(opts: NameOptions = {}): string {
  const f = fakerFor(opts.locale);
  const suffix = `E2E-${uid}`;
  let base = f.company.name();
  if (opts.maxLength != null) {
    const fixed = [opts.tag, suffix].filter(Boolean).join(" ");
    const room = opts.maxLength - fixed.length - 1; // -1 for the space before `fixed`
    if (base.length > room) base = room > 0 ? base.slice(0, room).trimEnd() : "";
  }
  return [base, opts.tag, suffix].filter(Boolean).join(" ");
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
  const { codePrefix = "E2E", tag, locale, nameMaxLength } = opts;
  return {
    code: fakeCode(codePrefix),
    name: fakeName({ tag, locale, maxLength: nameMaxLength }),
    nameUpdated: fakeName({ tag: tag ? `${tag} Upd` : "Upd", locale, maxLength: nameMaxLength }),
    description: fakeDescription({ locale }),
  };
}
