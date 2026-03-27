const fs = require("fs");
const path = require("path");

const ROOT = path.join(process.cwd(), "app");

function walk(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results = results.concat(walk(full));
    else results.push(full);
  }
  return results;
}

function fixBrokenPage(content) {
  let out = content;

  // Caso multilinea con params
  out = out.replace(
    /export default async function\s+([A-Za-z0-9_]+)\s*\(\{\s*\n?\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*\n?\s*params,\s*\n?\s*\}\s*:\s*\{([\s\S]*?)\}\s*\)\s*\{/g,
    'export default async function $1({\n  params,\n}: {$2}) {\n  const { prisma } = await import("@/lib/prisma");'
  );

  // Caso multilinea con params + searchParams
  out = out.replace(
    /export default async function\s+([A-Za-z0-9_]+)\s*\(\{\s*\n?\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*\n?\s*params,\s*\n?\s*searchParams,\s*\n?\s*\}\s*:\s*\{([\s\S]*?)\}\s*\)\s*\{/g,
    'export default async function $1({\n  params,\n  searchParams,\n}: {$2}) {\n  const { prisma } = await import("@/lib/prisma");'
  );

  // Caso multilinea con solo searchParams
  out = out.replace(
    /export default async function\s+([A-Za-z0-9_]+)\s*\(\{\s*\n?\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*\n?\s*searchParams,\s*\n?\s*\}\s*:\s*\{([\s\S]*?)\}\s*\)\s*\{/g,
    'export default async function $1({\n  searchParams,\n}: {$2}) {\n  const { prisma } = await import("@/lib/prisma");'
  );

  // Caso inline params
  out = out.replace(
    /export default async function\s+([A-Za-z0-9_]+)\s*\(\{\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*params\s*\}\s*:\s*\{([\s\S]*?)\}\s*\)\s*\{/g,
    'export default async function $1({ params }: {$2}) {\n  const { prisma } = await import("@/lib/prisma");'
  );

  // Caso inline searchParams
  out = out.replace(
    /export default async function\s+([A-Za-z0-9_]+)\s*\(\{\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*searchParams\s*\}\s*:\s*\{([\s\S]*?)\}\s*\)\s*\{/g,
    'export default async function $1({ searchParams }: {$2}) {\n  const { prisma } = await import("@/lib/prisma");'
  );

  // Caso inline params + searchParams
  out = out.replace(
    /export default async function\s+([A-Za-z0-9_]+)\s*\(\{\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*params,\s*searchParams\s*\}\s*:\s*\{([\s\S]*?)\}\s*\)\s*\{/g,
    'export default async function $1({ params, searchParams }: {$2}) {\n  const { prisma } = await import("@/lib/prisma");'
  );

  return out;
}

function processFile(file) {
  if (!file.endsWith("page.tsx")) return;

  const original = fs.readFileSync(file, "utf8");
  const fixed = fixBrokenPage(original);

  if (fixed !== original) {
    fs.writeFileSync(file, fixed, "utf8");
    console.log("FIXED PAGE:", file);
  }
}

walk(ROOT).forEach(processFile);

console.log("✅ BROKEN PAGES FIXED");