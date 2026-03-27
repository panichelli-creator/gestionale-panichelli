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
  let content = fs.readFileSync(file, "utf-8");

  let changed = false;

  // FIX API route.ts
  if (file.endsWith("route.ts")) {
    if (!content.includes('export const dynamic')) {
      content =
        `export const dynamic = "force-dynamic";\nexport const runtime = "nodejs";\n\n` +
        content;
      changed = true;
    }

    // prisma lazy import
    if (content.includes('from "@/lib/prisma"')) {
      content = content.replace(
        /import\s+\{\s*prisma\s*\}\s+from\s+["']@\/lib\/prisma["'];?/g,
        ""
      );

      if (!content.includes("await import")) {
        content = content.replace(
          /export async function (GET|POST|PUT|DELETE)/,
          `export async function $1(...args) {\n  const { prisma } = await import("@/lib/prisma");`
        );
      }

      changed = true;
    }
  }

  // FIX page.tsx
  if (file.endsWith("page.tsx")) {
    if (!content.includes('export const dynamic')) {
      content =
        `export const dynamic = "force-dynamic";\nexport const revalidate = 0;\n\n` +
        content;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, "utf-8");
    console.log("FIXED:", file);
  }
}

const files = walk(ROOT);

files.forEach(fixFile);

console.log("✅ DONE");