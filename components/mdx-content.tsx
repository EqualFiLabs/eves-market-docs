import type { ComponentProps } from "react";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Callout } from "@/components/callout";

const components = {
  Callout,
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
};

export async function MdxContent({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "prepend",
              properties: { className: ["heading-anchor"], ariaLabel: "Link to section" },
              content: { type: "text", value: "#" },
            },
          ],
          [rehypePrettyCode, { theme: "vitesse-dark", keepBackground: false, defaultLang: "text" }],
        ],
      },
    },
  });

  return <div className="article-body">{content}</div>;
}
