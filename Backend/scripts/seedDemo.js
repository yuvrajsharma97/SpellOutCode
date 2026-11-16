/**
 * Seed demo projects and updates for one account, so the public profile has
 * something to show.
 *
 *   npm run seed:demo -- <email>            add demo data (safe to re-run)
 *   npm run seed:demo -- <email> --remove   delete the demo data again
 *   npm run seed:demo -- <email> --profile  also fill empty profile fields
 *
 * Uses MONGO_URI from Backend/.env. If no account has that email, one is
 * created with a random password, printed once; use "Forgot password" to
 * set your own.
 *
 * Everything seeded is tagged "demo-seed", so --remove deletes exactly that
 * and never touches your real projects.
 */
require("dotenv").config();
const crypto = require("crypto");
const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("../src/models/user");
const Project = require("../src/models/project");
const Update = require("../src/models/update");

const DEMO_TAG = "demo-seed";
const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);

const PROFILE = {
  roleTitle: "Full-stack developer",
  bio: "I build small, sharp tools for the web and document every step, from the first commit to the final release.",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Tailwind CSS", "Go"],
};

// Each project: its age in days, and updates as [daysAgo, title, summary, html, published].
const PROJECTS = [
  {
    title: "Build Log Platform",
    summary: "A public build log where developers document projects as they ship them.",
    description: "A full-stack app for writing progress updates on side projects. React and TanStack Query on the front end, Express and MongoDB behind it, with email verification and rich-text updates.",
    techStack: ["React", "Express", "MongoDB", "TanStack Query"],
    status: "active",
    startedDaysAgo: 120,
    updates: [
      [118, "Kicking things off", "Why I'm building a public build log and what v1 needs.", "<p>Every side project I start dies quietly in a private repo. This one is about writing the journey down in public.</p><h2>Scope for v1</h2><ul><li>Profiles and projects</li><li>Rich-text progress updates</li><li>A clean public page per project</li></ul>", true],
      [96, "Auth is done (properly)", "httpOnly cookies, refresh rotation and email verification.", "<p>Went with <strong>httpOnly cookies</strong> instead of localStorage tokens. Refresh tokens rotate on every use and are revoked on logout.</p><p>Sign-up now sends a verification link before the account exists.</p>", true],
      [61, "The rich-text editor", "TipTap, sanitised HTML and a strict allowlist.", "<p>Updates are written in TipTap. Everything is sanitised against a strict tag allowlist before it's rendered.</p><pre><code>ALLOWED_TAGS: p, h1-h6, ul, ol, li, a, code, pre</code></pre>", true],
      [23, "Security pass", "Ran a full audit and fixed every lead it found.", "<p>Seventeen leads, all fixed: CSRF origin checks, per-account rate limits, draft visibility and more.</p><blockquote>Boring security work is the best kind.</blockquote>", true],
      [2, "Profile page redesign", "A bolder public profile with a project carousel.", "<p>The public profile now has a hero, stats, a project carousel and a featured section.</p>", true],
      [1, "Notes for next week", "Draft: ideas for comments and follows.", "<p>Thinking about comments, follows and RSS. Not public yet.</p>", false],
    ],
  },
  {
    title: "Pixel Garden",
    summary: "A tiny procedural garden that grows a little with every commit you push.",
    description: "A WebGL toy that reads a GitHub contribution feed and grows plants from it. Built with Three.js and Vite.",
    techStack: ["Three.js", "Vite", "GitHub API"],
    status: "completed",
    startedDaysAgo: 210,
    updates: [
      [205, "Seeds", "First procedural plant on screen.", "<p>An L-system and a few lines of Three.js later, something that looks like a fern.</p>", true],
      [170, "Wiring up commits", "Each commit now adds a growth step.", "<p>Contribution data drives growth. Busy weeks look like jungles.</p>", true],
      [140, "Shipped", "Live, open source and finished.", "<p>Pixel Garden is live. Calling it done and moving on.</p>", true],
    ],
  },
  {
    title: "Ledger CLI",
    summary: "Plain-text accounting from the terminal, with monthly reports.",
    description: "A small Go CLI that parses plain-text ledger files and prints monthly summaries and category breakdowns.",
    techStack: ["Go", "Cobra"],
    status: "paused",
    startedDaysAgo: 160,
    updates: [
      [155, "Parser first", "Reading ledger files into transactions.", "<p>The parser handles dates, payees, accounts and amounts. Tests cover the odd formats.</p>", true],
      [130, "Reports", "Monthly and per-category summaries.", "<p>Added <code>ledger report --month</code>. Pausing here while other projects take priority.</p>", true],
    ],
  },
  {
    title: "Trailhead",
    summary: "Offline-first hiking maps for iOS with trail recording.",
    description: "A SwiftUI app that caches map tiles for offline use and records trails with elevation profiles.",
    techStack: ["Swift", "SwiftUI", "MapKit"],
    status: "active",
    startedDaysAgo: 45,
    updates: [
      [44, "Why offline first", "Most trails have no signal.", "<p>Every hiking app I tried fails without signal. Trailhead caches everything up front.</p>", true],
      [18, "Recording trails", "GPS tracks and elevation charts.", "<p>Track recording works in the background, and each hike gets an elevation chart.</p>", true],
      [5, "Tile caching", "Downloading regions for offline use.", "<p>You can now pick a region and download its tiles before a trip.</p>", true],
    ],
  },
  {
    title: "Inkwell",
    summary: "A minimal writing app with markdown and sync.",
    description: "A distraction-free writing app built with Next.js and Postgres, syncing drafts between devices.",
    techStack: ["Next.js", "Postgres", "Prisma"],
    status: "completed",
    startedDaysAgo: 300,
    updates: [
      [295, "The blank page", "Designing a writing app that stays out of the way.", "<p>No toolbars and no sidebars, just text and a word count.</p>", true],
      [260, "Sync", "Drafts follow you between devices.", "<p>Conflict-free merging was the hard part. Last-write-wins per paragraph was good enough.</p>", true],
      [230, "1.0", "Inkwell is done.", "<p>Shipped 1.0. It's the app I write everything in now.</p>", true],
    ],
  },
  {
    title: "Old Portfolio",
    summary: "The previous portfolio site, kept for history.",
    description: "A Gatsby portfolio from a few years ago, archived after the move to a build-log style profile.",
    techStack: ["Gatsby", "GraphQL"],
    status: "archived",
    startedDaysAgo: 700,
    updates: [[690, "Archived", "Replaced by the build log.", "<p>Retired in favour of documenting projects as I build them.</p>", true]],
  },
];

async function uniqueSlug(title) {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  let slug = base;
  while (await Project.exists({ slug })) {
    slug = `${base}-${crypto.randomBytes(3).toString("hex")}`;
  }
  return slug;
}

async function findOrCreateUser(email) {
  const existing = await User.findOne({ email });
  if (existing) return { user: existing, created: false };

  const local = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "demo";
  let username = local.length >= 3 ? local : `${local}user`;
  while (await User.exists({ username })) username = `${local}${crypto.randomInt(100, 999)}`;

  const password = crypto.randomBytes(12).toString("base64url");
  const user = await User.create({ name: "Demo User", username, email, password });
  return { user, created: true, password };
}

async function removeDemo(user) {
  const projects = await Project.find({ author: user._id, tags: DEMO_TAG }).select("_id");
  const ids = projects.map((p) => p._id);
  const { deletedCount: updates } = await Update.deleteMany({ project: { $in: ids } });
  const { deletedCount: removed } = await Project.deleteMany({ _id: { $in: ids } });
  return { projects: removed, updates };
}

async function main() {
  const args = process.argv.slice(2);
  const email = (args.find((a) => !a.startsWith("--")) || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    console.error("Usage: npm run seed:demo -- <email> [--remove] [--profile]");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to Backend/.env first.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  if (args.includes("--remove")) {
    const user = await User.findOne({ email });
    if (!user) throw new Error(`No account with email ${email}.`);
    const r = await removeDemo(user);
    console.log(`Removed ${r.projects} demo projects and ${r.updates} updates from @${user.username}.`);
    return;
  }

  const { user, created, password } = await findOrCreateUser(email);

  // Fill empty profile fields only; never overwrite what the user wrote.
  if (created || args.includes("--profile")) {
    for (const [key, value] of Object.entries(PROFILE)) {
      const empty = Array.isArray(user[key]) ? user[key].length === 0 : !user[key];
      if (empty) user[key] = value;
    }
    await user.save({ validateBeforeSave: false });
  }

  // Re-running replaces the previous demo data instead of duplicating it.
  await removeDemo(user);

  let projectCount = 0;
  let updateCount = 0;
  for (const def of PROJECTS) {
    const latest = Math.min(...def.updates.map((u) => u[0]));
    const project = new Project({
      title: def.title,
      summary: def.summary,
      description: def.description,
      techStack: def.techStack,
      tags: [DEMO_TAG],
      status: def.status,
      slug: await uniqueSlug(def.title),
      author: user._id,
    });
    await project.validate();
    // Insert with back-dated timestamps so the timeline looks real.
    await Project.collection.insertOne({
      ...project.toObject(),
      createdAt: daysAgo(def.startedDaysAgo),
      updatedAt: daysAgo(latest),
    });
    projectCount++;

    for (const [ago, title, summary, content, published] of def.updates) {
      const update = new Update({ project: project._id, author: user._id, title, summary, content, published, tags: [DEMO_TAG] });
      await update.validate();
      await Update.collection.insertOne({ ...update.toObject(), createdAt: daysAgo(ago), updatedAt: daysAgo(ago) });
      updateCount++;
    }
  }

  console.log(`Seeded ${projectCount} projects and ${updateCount} updates for @${user.username}.`);
  if (created) {
    console.log(`Created a new account. Temporary password: ${password}`);
    console.log("Sign in and change it, or use \"Forgot password\".");
  }
  console.log(`Public profile path: /${user.username}`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
