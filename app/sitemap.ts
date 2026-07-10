import type { MetadataRoute } from "next";

import { getAllPages, getPageHref } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllPages().map((page) => ({
    url: `${SITE_URL}${getPageHref(page)}/`,
    lastModified: page.updated,
  }));
}
