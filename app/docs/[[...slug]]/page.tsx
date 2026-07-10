import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsPage } from "@/components/docs-page";
import { getDocPageBySlug, getPageHref, getStaticDocSlugs } from "@/lib/docs";

type Props = {
  params: {
    slug?: string[];
  };
};

export function generateStaticParams() {
  return getStaticDocSlugs().map((slug: string[]) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getDocPageBySlug(params.slug);

  if (!page) {
    return {};
  }

  const path = `${getPageHref(page)}/`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: page.title,
      description: page.description,
    },
  };
}

export default function DocPageRoute({ params }: Props) {
  const page = getDocPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <DocsPage page={page} />;
}
