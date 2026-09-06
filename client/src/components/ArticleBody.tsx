/*
Design reminder for this file:
Long-form reading surface. Generous line height, clear heading hierarchy,
restrained gold accents. Should read like a letter, not a landing page.
*/

/**
 * Renders article content written in the light markup used throughout
 * shared/blogArticles.ts.
 *
 * Previously this text was dropped into a whitespace-pre-wrap div, so a section
 * break written as **The Cost of Silence** displayed with its asterisks showing
 * and produced no heading element at all. Every article was one undifferentiated
 * block of text with a single h1 above it.
 *
 * The supported markup, inferred from the existing articles:
 *   - A line that is entirely **wrapped** becomes an <h2> section heading.
 *   - Lines starting with "- " become <li> inside a <ul>.
 *   - Everything else is a paragraph, with inline **bold** kept as <strong>.
 *   - [text](url) becomes a link. Outbound links open in a new tab, and links to
 *     any host listed in AFFILIATE_DOMAINS automatically carry
 *     rel="sponsored nofollow" as Google requires for paid placements.
 *
 * No article wording is changed by any of this.
 */

import { Fragment, type ReactNode } from "react";
import { classifyLink, relForLink } from "@shared/seo";

type Block =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

const HEADING_PATTERN = /^\*\*(.+)\*\*$/;

/** Splits raw article content into semantic blocks. Exported for testing. */
export function parseArticleContent(content: string): Block[] {
  const blocks: Block[] = [];
  let listBuffer: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ kind: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraphBuffer.join(" ") });
      paragraphBuffer = [];
    }
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = HEADING_PATTERN.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", text: heading[1].trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.slice(2).trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/** Splits on **bold** and [text](url) without touching the surrounding words. */
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode {
  const segments = text.split(INLINE_PATTERN).filter(Boolean);

  return segments.map((segment, index) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(segment);
    if (bold) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {bold[1]}
        </strong>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(segment);
    if (link) {
      const [, label, href] = link;
      const kind = classifyLink(href);
      return (
        <a
          key={index}
          href={href}
          rel={relForLink(kind)}
          target={kind === "internal" ? undefined : "_blank"}
          className="text-brand-gold underline underline-offset-4 transition hover:text-brand-gold/80"
        >
          {label}
        </a>
      );
    }

    return <Fragment key={index}>{segment}</Fragment>;
  });
}

export default function ArticleBody({ content }: { content: string }) {
  const blocks = parseArticleContent(content);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return (
            <h2
              key={index}
              className="pt-4 font-display text-2xl leading-snug text-foreground md:text-3xl"
            >
              {block.text}
            </h2>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={index} className="space-y-3 pl-5">
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="list-disc marker:text-brand-gold text-lg leading-relaxed text-muted-foreground"
                >
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-lg leading-relaxed text-muted-foreground">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
