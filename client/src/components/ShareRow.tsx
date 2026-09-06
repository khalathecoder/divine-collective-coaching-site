/*
Design reminder for this file:
Small, quiet control. Gold icons on card-coloured circles, matching the blog.
*/

/**
 * Share controls for an article.
 *
 * Replaces three anchors that pointed at href="#" and did nothing when clicked.
 * Facebook, LinkedIn and X have real web sharing endpoints; email uses a mailto
 * link; the last slot copies the canonical URL. Instagram is deliberately absent
 * because it offers no web share endpoint, so any such button would be a
 * decoration that does nothing.
 *
 * Every target receives the article's canonical URL, so shares, and any links
 * they earn, all point at the one indexable address for that post.
 */

import { useState } from "react";
import { Facebook, Linkedin, Mail, Link2, Check } from "lucide-react";

const ICON_CLASS =
  "flex h-10 w-10 items-center justify-center rounded-full bg-card transition-colors hover:bg-card/80";

/** lucide-react has no current X mark, so this is the official glyph. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareRow({
  url,
  title,
  excerpt,
}: {
  url: string;
  title: string;
  excerpt?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context or permission denied).
      // Nothing to recover from -- the URL is still in the address bar.
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const emailBody = encodeURIComponent(
    `${excerpt ? `${excerpt}\n\n` : ""}${url}`
  );

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-foreground">Share this article</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON_CLASS}
          aria-label={`Share "${title}" on Facebook`}
        >
          <Facebook className="h-5 w-5 text-brand-gold" />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON_CLASS}
          aria-label={`Share "${title}" on LinkedIn`}
        >
          <Linkedin className="h-5 w-5 text-brand-gold" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON_CLASS}
          aria-label={`Share "${title}" on X`}
        >
          <XIcon className="h-4 w-4 text-brand-gold" />
        </a>
        <a
          href={`mailto:?subject=${encodedTitle}&body=${emailBody}`}
          className={ICON_CLASS}
          aria-label={`Share "${title}" by email`}
        >
          <Mail className="h-5 w-5 text-brand-gold" />
        </a>
        <button
          type="button"
          onClick={copyLink}
          className={ICON_CLASS}
          aria-label={copied ? "Link copied" : `Copy link to "${title}"`}
        >
          {copied ? (
            <Check className="h-5 w-5 text-brand-gold" />
          ) : (
            <Link2 className="h-5 w-5 text-brand-gold" />
          )}
        </button>
      </div>
    </div>
  );
}
