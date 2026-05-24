import fs from "node:fs";
import path from "node:path";

export type DocPage = {
  id: string;
  slug: string[];
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  updated: string;
  order: number;
  badge?: string;
  sections: DocSection[];
};

export type DocSection = {
  id: string;
  title: string;
  blocks: DocBlock[];
};

export type DocBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "code"; language: string; label: string; content: string }
  | { type: "callout"; tone: "note" | "success" | "warning"; title: string; body: string };

type Frontmatter = Omit<DocPage, "slug" | "order" | "sections"> & {
  slug: string;
  order: string;
};

const docsDirectory = path.join(process.cwd(), "content", "docs");

function findMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return findMdxFiles(entryPath);
      }
      return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
    })
    .sort();
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  if (!raw.startsWith("---\n")) {
    throw new Error("Docs pages must start with frontmatter.");
  }

  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Docs page frontmatter is missing a closing delimiter.");
  }

  const frontmatterLines = raw.slice(4, end).trim().split("\n");
  const entries = frontmatterLines.map((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`Invalid frontmatter line: ${line}`);
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^"|"$/g, "");
    return [key, value];
  });

  return {
    frontmatter: Object.fromEntries(entries) as Frontmatter,
    body: raw.slice(end + 4).trim(),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTable(lines: string[], startIndex: number): { block: DocBlock; nextIndex: number } {
  const tableLines: string[] = [];
  let index = startIndex;
  while (index < lines.length && lines[index].trim().startsWith("|")) {
    tableLines.push(lines[index].trim());
    index += 1;
  }

  const rows = tableLines
    .filter((line, rowIndex) => rowIndex !== 1)
    .map((line) =>
      line
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim()),
    );

  return {
    block: {
      type: "table",
      columns: rows[0] ?? [],
      rows: rows.slice(1),
    },
    nextIndex: index,
  };
}

function parseCode(lines: string[], startIndex: number): { block: DocBlock; nextIndex: number } {
  const opening = lines[startIndex].trim();
  const meta = opening.replace(/^```/, "").trim();
  const [language = "text", ...labelParts] = meta.split(/\s+/);
  const codeLines: string[] = [];
  let index = startIndex + 1;
  while (index < lines.length && !lines[index].startsWith("```")) {
    codeLines.push(lines[index]);
    index += 1;
  }

  return {
    block: {
      type: "code",
      language,
      label: labelParts.join(" ") || "Example",
      content: codeLines.join("\n"),
    },
    nextIndex: index + 1,
  };
}

function parseCallout(lines: string[], startIndex: number): { block: DocBlock; nextIndex: number } {
  const opening = lines[startIndex].trim();
  const [, tone = "note", ...titleParts] = opening.split(/\s+/);
  const bodyLines: string[] = [];
  let index = startIndex + 1;
  while (index < lines.length && lines[index].trim() !== ":::") {
    bodyLines.push(lines[index]);
    index += 1;
  }

  return {
    block: {
      type: "callout",
      tone: tone === "success" || tone === "warning" ? tone : "note",
      title: titleParts.join(" ") || "Note",
      body: bodyLines.join(" ").trim(),
    },
    nextIndex: index + 1,
  };
}

function parseBlocks(lines: string[]) {
  const blocks: DocBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const parsed = parseCode(lines, index);
      blocks.push(parsed.block);
      index = parsed.nextIndex;
      continue;
    }

    if (line.startsWith(":::")) {
      const parsed = parseCallout(lines, index);
      blocks.push(parsed.block);
      index = parsed.nextIndex;
      continue;
    }

    if (line.startsWith("|")) {
      const parsed = parseTable(lines, index);
      blocks.push(parsed.block);
      index = parsed.nextIndex;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("## ") &&
      !lines[index].trim().startsWith("- ") &&
      !lines[index].trim().startsWith("|") &&
      !lines[index].trim().startsWith("```") &&
      !lines[index].trim().startsWith(":::")
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function parseSections(body: string): DocSection[] {
  const lines = body.split("\n");
  const sections: DocSection[] = [];
  let currentTitle = "Overview";
  let currentLines: string[] = [];

  function pushSection() {
    const blocks = parseBlocks(currentLines);
    if (blocks.length > 0 || sections.length === 0) {
      sections.push({
        id: slugify(currentTitle),
        title: currentTitle,
        blocks,
      });
    }
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      pushSection();
      currentTitle = line.slice(3).trim();
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }
  pushSection();

  return sections.filter((section) => section.blocks.length > 0);
}

function loadPages() {
  return findMdxFiles(docsDirectory)
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const { frontmatter, body } = parseFrontmatter(raw);
      return {
        id: frontmatter.id,
        slug: frontmatter.slug.split("/").filter(Boolean),
        label: frontmatter.label,
        eyebrow: frontmatter.eyebrow,
        title: frontmatter.title,
        description: frontmatter.description,
        status: frontmatter.status,
        updated: frontmatter.updated,
        order: Number(frontmatter.order),
        badge: "badge" in frontmatter ? frontmatter.badge : undefined,
        sections: parseSections(body),
      };
    })
    .sort((left, right) => left.order - right.order);
}

export function getAllPages() {
  return loadPages();
}

export function getStaticDocSlugs() {
  return getAllPages().map((page) => page.slug);
}

export function getDocPageBySlug(slug?: string[]) {
  const normalized = slug && slug.length > 0 ? slug : ["introduction"];
  return getAllPages().find((page) => page.slug.join("/") === normalized.join("/")) ?? null;
}

export function getPageHref(page: Pick<DocPage, "slug">) {
  return `/docs/${page.slug.join("/")}`;
}

export function getNavigationGroups() {
  const groups = ["Core", "Markets", "Resolution", "Collateral", "Tokens", "Reference"];
  const pages = getAllPages();

  return groups
    .map((title) => ({
      title,
      pages: pages.filter(
        (page) => page.slug[0] === title.toLowerCase() || (title === "Core" && page.slug[0] === "introduction"),
      ),
    }))
    .filter((group) => group.pages.length > 0);
}
