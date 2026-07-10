import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";

export type TocEntry = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type DocPage = {
  id: string;
  slug: string[];
  label: string;
  title: string;
  description: string;
  updated: string;
  order: number;
  badge?: string;
  body: string;
  toc: TocEntry[];
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

/**
 * Rewrites the two content conventions that predate the MDX pipeline into
 * standard MDX, so the .mdx files themselves stay untouched:
 *   - `:::tone Title` … `:::` callouts become <Callout> elements
 *   - ```lang Label fences become ```lang title="Label" for rehype-pretty-code
 */
export function preprocessMdx(source: string): string {
  const defaultTitles: Record<string, string> = {
    note: "Note",
    success: "Note",
    warning: "Note",
  };

  let output = source.replace(
    /^:::(note|success|warning)[ \t]*([^\n]*)\n([\s\S]*?)\n:::[ \t]*$/gm,
    (_match, tone: string, title: string, body: string) => {
      const heading = title.trim() || defaultTitles[tone];
      return `<Callout tone="${tone}" title="${heading}">\n\n${body}\n\n</Callout>`;
    },
  );

  output = output.replace(/^```(\w+)[ \t]+([^\n{"]+?)[ \t]*$/gm, '```$1 title="$2"');
  output = output.replace(/^```(\w+)[ \t]*$/gm, '```$1 title="Example"');

  return output;
}

export function extractToc(source: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }
    const match = line.match(/^(#{2,3}) (.+)$/);
    if (match) {
      const title = match[2].trim();
      entries.push({
        id: slugger.slug(title),
        title,
        depth: match[1].length as 2 | 3,
      });
    }
  }

  return entries;
}

function loadPages(): DocPage[] {
  return findMdxFiles(docsDirectory)
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      // YAML parses unquoted dates like `updated: 2026-07-09` into Date objects.
      const updated =
        data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated);
      return {
        id: String(data.id),
        slug: String(data.slug).split("/").filter(Boolean),
        label: String(data.label),
        title: String(data.title),
        description: String(data.description),
        updated,
        order: Number(data.order),
        badge: data.badge ? String(data.badge) : undefined,
        body: preprocessMdx(content),
        toc: extractToc(content),
      };
    })
    .sort((left, right) => left.order - right.order);
}

let pagesCache: DocPage[] | null = null;

export function getAllPages() {
  // Skip the cache in dev so content edits show up without a server restart.
  if (process.env.NODE_ENV !== "production") {
    return loadPages();
  }
  if (!pagesCache) {
    pagesCache = loadPages();
  }
  return pagesCache;
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
