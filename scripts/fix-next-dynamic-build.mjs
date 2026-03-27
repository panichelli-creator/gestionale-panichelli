import fs from "fs";
import path from "path";

const root = process.cwd();
const appDir = path.join(root, "app");

function walk(dir, out = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === "node_modules" || item.name === ".next" || item.name === ".git") continue;
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function normalize(p) {
  return p.replace(/\\/g, "/");
}

function hasLine(content, line) {
  return content.includes(line);
}

function injectAfterImports(content, block) {
  const importRegex = /^(import[\s\S]*?from\s+["'][^"']+["'];?\r?\n)+/;
  const match = content.match(importRegex);

  if (match) {
    const imports = match[0];
    const rest = content.slice(imports.length);
    return `${imports}\n${block}\n${rest}`;
  }

  return `${block}\n\n${content}`;
}

function ensureApiRouteFlags(content) {
  let next = content;

  if (!hasLine(next, 'export const dynamic = "force-dynamic";')) {
    next = injectAfterImports(next, 'export const dynamic = "force-dynamic";');
  }

  return next;
}

function ensurePageFlags(content) {
  let next = content;

  const needed = [];
  if (!hasLine(next, 'export const dynamic = "force-dynamic";')) {
    needed.push('export const dynamic = "force-dynamic";');
  }
  if (!hasLine(next, "export const revalidate = 0;")) {
    needed.push("export const revalidate = 0;");
  }

  if (!needed.length) return next;

  next = injectAfterImports(next, needed.join("\n"));
  return next;
}

function shouldForceDynamicPage(filePath, content) {
  const p = normalize(filePath);

  if (!p.endsWith("/page.tsx")) return false;

  if (p.includes("/app/api/")) return false;

  if (p.includes("/app/(admin)/")) return true;

  if (p.includes("/[") || p.includes("]/")) return true;

  if (content.includes('from "@/lib/prisma"')) return true;
  if (content.includes("await prisma.")) return true;
  if (content.includes("findUnique(")) return true;
  if (content.includes("findMany(")) return true;
  if (content.includes("count(")) return true;

  return false;
}

const files = walk(appDir);

let changed = 0;

for (const file of files) {
  const p = normalize(file);

  if (!p.endsWith(".ts") && !p.endsWith(".tsx")) continue;

  let content = fs.readFileSync(file, "utf8");
  let next = content;

  if (p.includes("/app/api/") && p.endsWith("/route.ts")) {
    next = ensureApiRouteFlags(next);
  } else if (shouldForceDynamicPage(file, content)) {
    next = ensurePageFlags(next);
  }

  if (next !== content) {
    fs.writeFileSync(file, next, "utf8");
    console.log("FIXED:", p.replace(normalize(root) + "/", ""));
    changed++;
  }
}

console.log(`\nDone. Files changed: ${changed}`);