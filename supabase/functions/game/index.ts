// public/questions.mjs
var q = (id, topic, title, answer, unit, difficulty, family, explanation, source = null, label = "Work it out") => ({ id, topic, title, answer, unit, difficulty, family, explanation, source, label });
var QUESTIONS = [
  q("die", "games", "Faces on a normal die", 6, "faces", "anchor", "die", "A normal die is a cube, with one face for each number from 1 to 6."),
  q("deck", "games", "Cards in a poker deck, without jokers", 52, "cards", "anchor", "cards", "Four suits, with thirteen cards in each: 4 \xD7 13 = 52.", "https://mathworld.wolfram.com/Cards.html", "Wolfram MathWorld"),
  q("chessboard", "games", "Small squares on a chessboard", 64, "squares", "anchor", "chess", "A chessboard has 8 rows and 8 columns: 8 \xD7 8 = 64.", "https://new.uschess.org/sites/default/files/media/documents/us-chess-rule-book-online-only-edition-chapters-1-2-9-10-11-2024.pdf", "US Chess"),
  q("eggs", "food", "Eggs in a dozen", 12, "eggs", "anchor", "dozen", "A dozen means twelve. A baker\u2019s dozen is different: thirteen."),
  q("litre", "kitchen", "Millilitres in a litre", 1e3, "millilitres", "anchor", "volume", "A millilitre is one thousandth of a litre, so a litre holds 1,000 millilitres."),
  q("alphabet", "words", "Letters in the English alphabet", 26, "letters", "anchor", "alphabet", "Count A through Z: there are 26 letters."),
  q("minute", "time", "Seconds in a minute", 60, "seconds", "anchor", "time", "A minute contains sixty seconds."),
  q("leap-year", "time", "Days in a leap year", 366, "days", "anchor", "time", "A leap year adds 29 February to the usual 365 days: 365 + 1 = 366."),
  q("stop-sign", "everyday", "Sides on a standard stop sign", 8, "sides", "anchor", "shapes", "A standard stop sign is an octagon: a shape with eight sides."),
  q("football-match", "sport", "Minutes in a football match, before added time", 90, "minutes", "anchor", "football", "Two halves of 45 minutes make 90 minutes. Added time and extra time are not included.", "https://www.theifab.com/laws/latest/the-duration-of-the-match/", "IFAB"),
  q("football-team", "sport", "Players per football team on the pitch at kick-off", 11, "players", "anchor", "football", "A full side in standard association football has eleven players, including the goalkeeper. Substitutes are not counted.", "https://www.theifab.com/laws/latest/the-players/", "IFAB"),
  q("basketball", "sport", "Players per basketball team on court at once", 5, "players", "anchor", "basketball", "In standard five-a-side basketball, each team has five players on court.", "https://assets.fiba.basketball/image/upload/documents-corporate-wabc-start-coaching-eng-coach-workbook.pdf", "FIBA"),
  q("cube", "everyday", "Faces on a cube", 6, "faces", "anchor", "die", "A cube has a top, a bottom, and four sides: six faces altogether."),
  q("triangle", "everyday", "Sides on a triangle", 3, "sides", "anchor", "shapes", "A triangle has three straight sides."),
  q("square", "everyday", "Corners on a square", 4, "corners", "anchor", "shapes", "A square has four corners, one where each pair of sides meets."),
  q("day-hours", "time", "Hours in a day", 24, "hours", "anchor", "time", "An ordinary calendar day has 24 hours."),
  q("week-days", "time", "Days in a week", 7, "days", "anchor", "time", "Monday through Sunday: seven days."),
  q("year-days", "time", "Days in a year that is not a leap year", 365, "days", "anchor", "time", "An ordinary year has 365 days. Leap years add one more."),
  q("century", "time", "Years in a century", 100, "years", "anchor", "time", "A century is one hundred years: ten decades."),
  q("decade", "time", "Years in a decade", 10, "years", "anchor", "time", "A decade is ten years."),
  q("piano", "music", "Keys on a full-size piano", 88, "keys", "medium", "piano", "A standard full-size piano has 88 keys. Smaller keyboards can have fewer.", "https://usa.yamaha.com/musical-instruments/pianos/products/p-series/p-225/specs.html", "Yamaha"),
  q("piano-white", "music", "White keys on a full-size piano", 52, "white keys", "medium", "piano", "A standard 88-key piano has 52 white keys and 36 black keys. You can count seven complete A-to-G groups plus the final C.", "https://en.wikipedia.org/wiki/Piano", "Piano reference"),
  q("piano-black", "music", "Black keys on a full-size piano", 36, "black keys", "medium", "piano", "The black keys repeat in groups of two and three. Across a standard 88-key piano, there are 36 black keys.", "https://en.wikipedia.org/wiki/Piano", "Piano reference"),
  q("adult-teeth", "body", "Teeth in a full adult set, including wisdom teeth", 32, "teeth", "medium", "human-teeth", "A complete adult set has sixteen teeth in each jaw, including four wisdom teeth. Not everyone keeps or develops all of them.", "https://www.mouthhealthy.org/all-topics-a-z/eruption-charts", "American Dental Association"),
  q("baby-teeth", "body", "Teeth in a complete set of baby teeth", 20, "teeth", "medium", "human-teeth", "A complete set of baby teeth has ten in the top jaw and ten in the bottom: twenty altogether.", "https://www.mouthhealthy.org/all-topics-a-z/baby-teeth.aspx/", "American Dental Association"),
  q("scrabble", "games", "Tiles in a standard English Scrabble set", 100, "tiles", "medium", "scrabble", "The standard English-language game has 100 tiles, including the two blank tiles.", "https://www.hasbro.com/common/instruct/scrabble.pdf", "Hasbro"),
  q("monopoly", "games", "Spaces around a classic Monopoly board", 40, "spaces", "medium", "monopoly", "There are ten spaces along each side when each corner is counted once: forty around the board.", "https://mms.businesswire.com/media/20150121006051/en/448463/1/80_Things_You_Didn%27t_Know_About_Monopoly_FINAL.pdf?download=1", "Hasbro"),
  q("week-hours", "time", "Hours in a week", 168, "hours", "medium", "time", "Seven days, each with 24 hours: 7 \xD7 24 = 168."),
  q("octopus-hearts", "animals", "Hearts in an octopus", 3, "hearts", "surprise", "octopus", "An octopus has three hearts: two pump blood to the gills, and the third pumps it around the body.", "https://education.nationalgeographic.org/resource/animals-101-octopuses/", "National Geographic"),
  q("giraffe-neck", "animals", "Neck bones in a giraffe", 7, "neck bones", "surprise", "giraffe", "Usually seven, just like most mammals. A giraffe\u2019s neck bones are much longer.", "https://vanat.ahc.umn.edu/museum/pages/GiraffeCerVert1a.html", "University of Minnesota"),
  q("dog-teeth", "animals", "Teeth in a full adult dog\u2019s set", 42, "teeth", "surprise", "dog", "A full adult dog\u2019s set normally has 42 permanent teeth.", "https://www.merckvetmanual.com/dog-owners/digestive-disorders-of-dogs/dental-development-of-dogs", "Merck Veterinary Manual"),
  q("bee-eyes", "animals", "Eyes on a honeybee", 5, "eyes", "surprise", "bee", "Two large compound eyes and three small simple eyes make five in total.", "https://extension.arizona.edu/sites/extension.arizona.edu/files/pubs/az2011-2022.pdf", "University of Arizona")
];

// public/order.mjs
var GAME_VERSION = "order-v3";
var TITLES = Object.fromEntries(QUESTIONS.map((q2) => [q2.id, q2.title]));
var facts = QUESTIONS;
var day = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function random(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 1831565813;
    let t = Math.imul(h ^ h >>> 15, h | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(array, r) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function create(mode = "daily", seed = day()) {
  const r = random(GAME_VERSION + ":" + (mode === "practice" ? "practice:" : "") + seed), chosen = [];
  for (const difficulty of ["surprise", "medium", "anchor", "anchor", "anchor"]) {
    const options = shuffle(facts.filter((f2) => f2.difficulty === difficulty), r);
    const f = options.find((f2) => !chosen.some((x) => x.id === f2.id || x.answer === f2.answer || x.family === f2.family) && chosen.filter((x) => x.topic === f2.topic).length < 2 && !(f2.answer <= 10 && chosen.some((x) => x.answer <= 10)));
    if (!f) throw Error("Could not build a balanced puzzle");
    chosen.push(f);
  }
  const ids = shuffle(chosen.map((f) => f.id), r), order = shuffle(ids, r);
  if (order.every((id, i) => id === [...ids].sort((a, b) => facts.find((f) => f.id === b).answer - facts.find((f) => f.id === a).answer)[i])) [order[0], order[1]] = [order[1], order[0]];
  return { version: 4, mode, seed, ids, order, locked: [], attempts: [], done: false, won: false };
}
var fact = (id) => facts.find((f) => f.id === id);
var solution = (run) => [...run.ids].sort((a, b) => fact(b).answer - fact(a).answer);
function check(run) {
  if (run.done) return;
  const truth = solution(run), matches = run.order.map((id, i) => id === truth[i]);
  run.attempts.push({ order: [...run.order], matches });
  run.locked = matches.flatMap((v, i) => v ? [i] : []);
  run.won = run.locked.length === 5;
  run.done = run.won || run.attempts.length === 3;
  return matches;
}
function restore(raw) {
  if (!raw || raw.version !== 4 || !["daily", "practice"].includes(raw.mode) || typeof raw.seed !== "string" || raw.seed.length > 64 || !Array.isArray(raw.attempts) || raw.attempts.length > 3) throw Error("Invalid game");
  const run = create(raw.mode, raw.seed);
  for (const a of raw.attempts) {
    if (!Array.isArray(a.order) || a.order.length !== 5 || new Set(a.order).size !== 5 || a.order.some((id) => !run.ids.includes(id)) || run.done) throw Error("Invalid attempt");
    for (const i of run.locked) if (a.order[i] !== run.order[i]) throw Error("Moved a locked card");
    run.order = [...a.order];
    check(run);
  }
  if (!Array.isArray(raw.order) || raw.order.length !== 5 || new Set(raw.order).size !== 5 || raw.order.some((id) => !run.ids.includes(id))) throw Error("Invalid order");
  for (const i of run.locked) if (raw.order[i] !== run.order[i]) throw Error("Moved a locked card");
  if (run.done && raw.order.some((id, i) => id !== run.order[i])) throw Error("Changed final order");
  run.order = [...raw.order];
  return run;
}

// worker/api.mjs
function distributionPercentages(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (!total) return null;
  const exact = counts.map((n) => n / total * 100), out = exact.map(Math.floor), priority = exact.map((n, i) => ({ i, fraction: n - Math.floor(n) })).sort((a, b) => b.fraction - a.fraction || a.i - b.i);
  for (let i = 0, left = 100 - out.reduce((a, b) => a + b, 0); i < left; i++) out[priority[i].i]++;
  return out;
}
function comparison(rows, mine, positions) {
  const bins = [0, 0, 0, 0];
  for (const row of rows) {
    const i = row.solved ? row.attempts - 1 : 3;
    bins[i] += Number(row.count);
  }
  const total = bins.reduce((a, b) => a + b, 0), others = [...bins];
  let rank = null;
  if (mine) {
    const index = mine.solved ? mine.attempts - 1 : 3;
    others[index] = Math.max(0, others[index] - 1);
    const n = total - 1, ahead = others.slice(index + 1).reduce((a, b) => a + b, 0), tied = others[index];
    rank = { position: 1 + others.slice(0, index).reduce((a, b) => a + b, 0), otherPlayers: n, ahead, tied, aheadPercent: n ? Math.round(ahead / n * 100) : null, percentile: n >= 5 ? Math.round((ahead + tied / 2) / n * 100) : null, tiePercent: n ? Math.round(tied / n * 100) : null };
  }
  const percentages = distributionPercentages(bins);
  return { total, bins, percentages, firstCorrect: [0, 1, 2, 3, 4].map((i) => Number(positions?.["p" + i] || 0)), mine: mine ? { solved: !!mine.solved, attempts: mine.attempts, correct: mine.correct } : null, rank };
}

// supabase/game-handler.mjs
function makeHandler({ rpc: rpc2, user: user2, origins: origins2, today = day }) {
  return async (request) => {
    const origin = request.headers.get("origin"), allowed = !origin || origins2.includes(origin);
    const headers = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "vary": "Origin" };
    if (origin && allowed) Object.assign(headers, { "access-control-allow-origin": origin, "access-control-allow-headers": "authorization, apikey, content-type, x-client-info", "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-max-age": "3600" });
    const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (!allowed) return json({ error: "This origin is not allowed." }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (!["GET", "POST"].includes(request.method)) return json({ error: "Method not allowed." }, 405);
    try {
      const token = request.headers.get("authorization");
      if (!token?.startsWith("Bearer ")) return json({ error: "A player session is required." }, 401);
      const player = await user2(token);
      if (!player) return json({ error: "Your player session expired. Reload to continue." }, 401);
      const url2 = new URL(request.url), route = url2.pathname.split("/").pop(), date = url2.searchParams.get("day") || today();
      if (!["session", "daily"].includes(route)) return json({ error: "Not found." }, 404);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date > today()) return json({ error: "Invalid puzzle date." }, 400);
      const args = { p_game: GAME_VERSION, p_day: date, p_player: player };
      const throttled = () => json({ error: "Too many requests. Try again in a minute." }, 429);
      const stats = (saved2) => ({ day: date, ...comparison(saved2.bins.map((count, i) => ({ count, solved: i < 3, attempts: i + 1 })), saved2.result, Object.fromEntries(saved2.first.map((value, i) => ["p" + i, value]))) });
      if (route === "daily") {
        if (request.method !== "GET") return json({ error: "Finish the daily using Check order." }, 405);
        const saved2 = await rpc2("ooo_stats", args);
        return saved2.rate_limited ? throttled() : json(stats(saved2));
      }
      if (date !== today()) return json({ error: "A new daily is available. Open the Daily tab." }, 400);
      const response = (saved2, status = 200) => saved2.rate_limited ? throttled() : json({ day: date, state: saved2.state, revision: saved2.revision, completed: !!saved2.result || !!saved2.state?.done, result: saved2.result, ...saved2.result ? { comparison: stats(saved2) } : {} }, status);
      if (request.method === "GET") return response(await rpc2("ooo_load", args));
      if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Send a JSON request." }, 415);
      if (Number(request.headers.get("content-length") || 0) > 16e3) return json({ error: "Request too large." }, 413);
      const text = await request.text();
      if (text.length > 16e3) return json({ error: "Request too large." }, 413);
      let body;
      try {
        body = JSON.parse(text);
        if (!body || typeof body !== "object") throw Error();
      } catch {
        return json({ error: "Invalid request." }, 400);
      }
      if (body.action === "resume") return response(await rpc2("ooo_resume_v2", { ...args, p_state: create("daily", date) }));
      if (body.action !== "check") return json({ error: "Invalid daily action." }, 400);
      const saved = await rpc2("ooo_load", args);
      if (saved.rate_limited) return throttled();
      if (saved.result || saved.state?.done) return response(saved);
      if (!saved.state || !Number.isInteger(body.revision) || body.revision !== saved.revision) return response(saved, 409);
      let next;
      try {
        next = restore({ ...saved.state, order: body.order });
      } catch {
        return json({ error: "Invalid card order." }, 400);
      }
      check(next);
      const updated = await rpc2("ooo_check", { ...args, p_revision: saved.revision, p_state: next });
      return response(updated, updated.conflict ? 409 : 200);
    } catch (error) {
      console.error("Game backend error:", error.message);
      return json({ error: "The daily is temporarily unavailable. Try again." }, 503);
    }
  };
}

// supabase/edge-entry.mjs
var url = Deno.env.get("SUPABASE_URL");
var key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
var origins = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map((s) => s.trim()).filter(Boolean);
var rpc = async (name, body) => {
  const response = await fetch(url + "/rest/v1/rpc/" + name, { method: "POST", headers: { apikey: key, authorization: "Bearer " + key, "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw Error("Database operation failed: " + name + " " + response.status);
  return response.json();
};
var user = async (authorization) => {
  const response = await fetch(url + "/auth/v1/user", { headers: { apikey: key, authorization } });
  if (!response.ok) return null;
  return (await response.json()).id || null;
};
Deno.serve(makeHandler({ rpc, user, origins }));
