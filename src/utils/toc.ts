import type { RemarkPlugin } from "@astrojs/markdown-remark";
import type { Heading, Root } from "mdast";
import Slugger from "github-slugger";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
export type HeadingItem = {
  id?: string;
  depth: number;
  value?: string;
  children?: Array<HeadingItem>;
};
function search(tree: Root) {
  const headings: Array<HeadingItem> = [];
  const slugger = new Slugger();

  function getFlatHeadingsList(node: Heading) {
    if (node.depth === 1) {
      return;
    }
    if (node.depth > 3) {
      return;
    }
    const h: HeadingItem = {
      id: slugger.slug(toString(node)),
      depth: node.depth,
      value: toString(node),
    };

    headings.push(h);
  }

  function buildHeadingsTree(headings: Array<HeadingItem>): Array<HeadingItem> {
    const root: HeadingItem = { depth: 0 };
    const parents: Array<HeadingItem> = [];
    let previous = root;

    headings.forEach((heading) => {
      if (heading.depth > previous.depth) {
        if (previous.children === undefined) {
          previous.children = [];
        }
        parents.push(previous);
      } else if (heading.depth < previous.depth) {
        while (parents[parents.length - 1].depth >= heading.depth) {
          parents.pop();
        }
      }

      parents[parents.length - 1].children?.push(heading);
      previous = heading;
    });

    return root.children || [];
  }

  visit(tree, "heading", getFlatHeadingsList);
  return buildHeadingsTree(headings);
}

export const Toc: RemarkPlugin = () => {
  return function (tree, { data }) {
    const result = search(tree);
    (data.astro as any).frontmatter.toc = result;
  };
};
