const fs = require("fs");
const path = require("path");

const ROOT = path.join(process.cwd(), "app");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });

  return results;
}

function fixBroken(content) {
  // FIX pattern rotto (...args) + (req: Request)
  content = content.replace(
    /export async function (GET|POST|PUT|DELETE)\(\.\.\.args\)\s*{\s*const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*\(req: Request\)\s*{/g,
    `export async function $1(req: Request) {\n  const { prisma } = await import("@/lib/prisma");`
  );

  // FIX pattern con params
  content = content.replace(
    /const \{ prisma \} = await import\("@\/lib\/prisma"\);\s*\(\s*req: Request,\s*\{\s*params\s*\}:[^)]*\)\s*{/g,
    `const { prisma } = await import("@/lib/prisma");`
  );

  return content;
}

function fixFile(file) {
  if (!file.endsWith("route.ts")) return;

  let content = fs.readFileSync(file, "utf-8");
  const fixed = fixBroken(content);

  if (fixed !== content) {
    fs.writeFileSync(file, fixed, "utf-8");
    console.log("FIXED BROKEN:", file);
  }
}

walk(ROOT).forEach(fixFile);

console.log("✅ BROKEN FIX DONE");