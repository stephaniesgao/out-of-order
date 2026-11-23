# Out of Order

Put five everyday facts in numerical order, **largest at the top**. Three checks. One daily puzzle. Practice is unlimited.

The interface is built for GitHub Pages. Supabase Auth assigns anonymous player sessions; an Edge Function validates every daily check; PostgreSQL stores attempts and aggregate comparisons. Players never get direct access to scores or other players' records.

## Development

```sh
npm ci
npm test
npm run dev
```

The local preview retains the original SQLite-backed API for development. The shared game model and scoring are used by both backends.

## Supabase deployment

1. Create a Supabase project and enable anonymous sign-ins in Authentication settings.
2. Apply `supabase/migrations/20261123010000_game.sql`.
3. Run `node scripts/build-supabase.mjs`.
4. Deploy `supabase/functions/game/index.ts` as the `game` Edge Function, with gateway JWT verification enabled. The function also verifies every player token with Supabase Auth itself.
5. Set the function secret `ALLOWED_ORIGINS` to the Pages origin, e.g. `https://stephaniesgao.github.io`. The runtime supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; never copy a secret key into frontend settings.

CLI alternative after signing in:

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
node scripts/build-supabase.mjs
supabase functions deploy game
```

Only the service role can call the persistence functions. Daily checks use revision checks and a database transaction; result insertion and percentage totals update together. Repeated requests cannot add a second result. Every player is limited to 60 backend requests per minute. This is not complete bot protection; configure Supabase's auth abuse controls for a larger launch.

## GitHub Pages

Set repository Actions variables `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` to the project's public values. Enable Pages with **GitHub Actions** as its source. Pushing to `main` runs tests, builds the static site, and publishes it.

```sh
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co \
SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY \
node scripts/build-pages.mjs
```

The build refuses secret keys. Anonymous sessions persist in browser storage. Clearing storage or changing browsers permits another guest identity; one attempt per human across devices would require permanent sign-in.

## Comparisons and privacy

A daily UTC date selects five facts from a bank of 32. Answers are compared as stated, without converting physical units. Each puzzle has three familiar facts, one medium question, and one surprise. Game edition `order-v3` uses descending order; older editions are excluded from current comparisons.

Results rank by solved-in-one, two, three, then unsolved. Ties split evenly. Percentiles exclude the current player's result and appear after five other finishes. The distribution chart includes the current game and rounds to 100%. Production comparisons contain only real submitted games.

The database stores anonymous player UUIDs, puzzle dates, progress, check counts, and outcomes. The browser holds its own auth session and personal stats. No name or email is requested by the game. Old ChatGPT-hosted player cookies cannot be carried across domains; the Supabase launch starts a new player cohort. Old records are retained on the previous backend until separately removed.

The original Sites worker and D1 migrations are retained as source history. No local database or deployment credentials belong in this repository.

## Usage optimizations and load checks

A normal completed daily uses one Edge Function request to resume, then one per check. The final response includes the comparison, avoiding a second request. It performs 3/5/7 database API round trips for one/two/three checks (previously 9/12/15). Request throttling is combined with data loading; it still counts each player request once. Comparison refreshes reuse results for 30 seconds and cannot overlap. Browsers may cache CORS preflights for an hour.

The percentages endpoint reads only a compact result and daily aggregate. It never downloads attempt history or scans all players. Existing primary keys cover the game/date/player and game/date lookups. Data access permissions and 60-request-per-minute protection are unchanged.

Run the isolated PostgreSQL workload with `node scripts/load-local.mjs`. It simulates 500 players with 50 queued workers, races duplicate completions, and checks that exactly 500 results and aggregate contributions exist. PGlite runs locally and serializes SQL, so this measures correctness under queued work, not hosted capacity.

`scripts/load-hosted.mjs` is a deliberately bounded hosted test: four temporary anonymous guests, 40 read requests before and 40 after deployment, and at most ten concurrent requests. It requires `LOAD_TEST_CONFIRM=out-of-order` plus `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `GAME_ORIGIN`. It waits between phases. Never expand it into an unbounded production stress test. Guest IDs are recorded under ignored `.local/load-test/players.json`; tokens remain in process memory. Remove only these test guests and their unfinished sessions after testing. No daily scores are submitted.

Fewer queries do not remove Supabase's monthly active user, function invocation, storage, or bandwidth limits. A viral-scale capacity claim requires a separate staging environment and a larger sustained test.
