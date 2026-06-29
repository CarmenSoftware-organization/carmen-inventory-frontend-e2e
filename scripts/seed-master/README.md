# Master seed

Reads a Preconfig Excel workbook (`sample_seed_data/`) and seeds a sample subset
of master data into an existing BU via the backend REST API.

## Usage

    bun run seed:master --dry-run                 # preview, no writes (read-only)
    bun run seed:master --bu BLAVG --yes          # live seed into BLAVG
    bun run seed:master --file fifo --limit 20    # use the FIFO workbook, 20 product/vendor rows
    bun run seed:master --only currency,unit      # seed selected entities only
    bun run seed:master --skip product,vendor     # seed everything except the big lists

Config comes from `SEED_*` env vars (in `.env.local`), falling back to the
frontend `config.json` for `BACKEND_URL`/`X_APP_ID`. `SEED_BU_CODE`,
`SEED_EMAIL`, `SEED_PASSWORD` are required (or pass `--bu`).

## Behaviour

- **Skip-existing:** records whose identity (code, or name for unit/tax-profile/
  delivery-point) already exists in the BU are skipped.
- **Sample subset:** lookups seed in full; Product and Vendor are capped by
  `--limit` (default 50). Products whose unit/item-group cannot be resolved are
  skipped.
- **Safety:** seeding a non-localhost target requires `--yes`. `--dry-run` is
  always read-only.
- **Out of scope:** Company Profile / BU creation.
