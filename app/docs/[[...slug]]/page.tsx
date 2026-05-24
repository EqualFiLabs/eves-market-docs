import { notFound } from "next/navigation";

import { DocsPage } from "@/components/docs-page";
import { getDocPageBySlug, getStaticDocSlugs } from "@/lib/docs";

type Props = {
  params: {
    slug?: string[];
  };
};

export function generateStaticParams() {
  return getStaticDocSlugs().map((slug: string[]) => ({ slug }));
}

export default function DocPageRoute({ params }: Props) {
  const page = getDocPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <DocsPage page={page} />;
}
