import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import { remarkReadingTime } from "./src/utils/reading-time";
import icon from "astro-icon";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Toc } from "./src/utils/toc";

// https://astro.build/config
export default defineConfig({
  site: "http://xwbx.ink",
  markdown: {
    shikiConfig: {
      experimentalThemes: {
        light: "solarized-light",
        dark: "solarized-dark",
      },
    },
    remarkPlugins: [remarkReadingTime, Toc],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
          },
          content: {
            type: "text",
            value: "\u200B",
          },
        },
      ],
    ],
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    vue(),
    icon(),
  ],
});
