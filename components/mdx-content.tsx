import type { ComponentProps } from "react";

import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { AddressChip } from "@/components/address-chip";
import { Callout } from "@/components/callout";
import { CodeFigcaption } from "@/components/code-figcaption";

const HEX_VALUE = /^0x[0-9a-fA-F]{40}$|^0x[0-9a-fA-F]{64}$/;

const components = {
  Callout,
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  figcaption: (props: ComponentProps<"figcaption">) => {
    if ("data-rehype-pretty-code-title" in props) {
      return <CodeFigcaption {...props} />;
    }
    return <figcaption {...props} />;
  },
  a: ({ href, children, ...rest }: ComponentProps<"a">) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
  code: (props: ComponentProps<"code">) => {
    if (typeof props.children === "string" && HEX_VALUE.test(props.children)) {
      return <AddressChip value={props.children} />;
    }
    return <code {...props} />;
  },
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
          [rehypePrettyCode, { theme: "vitesse-dark", keepBackground: false, defaultLang: { block: "text" } }],
        ],
      },
    },
  });

  return <div className="article-body">{content}</div>;
}
