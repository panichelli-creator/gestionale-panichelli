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

function fixFile(file) {
  if (!file.endsWith("page.tsx")) return;

  let content = fs.readFileSync(file, "utf-8");

  if (!content.includes('from "@/lib/prisma"')) return;

  // rimuove import prisma
  content = content.replace(
    /import\s+\{\s*prisma\s*\}\s+from\s+["']@\/lib\/prisma["'];?\n?/g,
    ""
  );

  // inserisce lazy import dopo export default async function
  content = content.replace(
    /export default async function[^{]*{/,
    (match) =>
      match + `\n  const { prisma } = await import("@/lib/prisma");`
  );

  fs.writeFileSync(file, content, "utf-8");
  console.log("FIXED PAGE:", file);
}

walk(ROOT).forEach(fixFile);

console.log("✅ FIX PAGE PRISMA DONE");