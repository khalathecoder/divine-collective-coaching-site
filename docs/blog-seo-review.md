# Blog SEO review — for Nancy's approval

**Branch:** `seo/blog-content-improvements`
**Date:** 6 September 2026

Everything in this branch is a **proposal**. Not one word Nancy wrote has been
changed, deleted, or reordered. Every addition lives in a single file
(`shared/blogEnrichment.ts`) that can be deleted to put the blog back exactly as
it is today.

If the answer is "keep it as is", nothing here ships. That is a legitimate
answer and the branch is built so it costs nothing to say it.

---

## What we measured

Nine posts, 3,221 words in total. Here is what the audit found, verified against
the actual article text rather than assumed.

| Problem | Detail |
|---|---|
| **Posts had no individual web address** | All nine lived behind tabs and buttons on one page, `/blog`. Google saw one page, not nine. Nothing could be linked to or shared. |
| **Every post was missing its own search phrase** | Not one of the nine contained the phrase people actually type to find that subject. The self-worth post never said "what the Bible says about self-worth". |
| **Section headings displayed as raw asterisks** | Text written as `**The Cost of Silence**` appeared on screen with the asterisks showing, and produced no heading Google could read. |
| **Five posts quote scripture without citing it** | "Death and life are in the power of the tongue" appears with no reference to Proverbs 18:21 — so it cannot rank for that verse. |
| **Zero links in any post** | A reader who finishes an article has nowhere to go. No post pointed at the quiz, the assessment, the shop, or a program. |
| **Three posts are very short** | 122, 169 and 218 words. Google generally will not rank a page that thin against a 1,500-word competitor. |

The first three are already fixed on the other branch
(`seo/blog-buildout-and-technical-fixes`) and required **no text changes at all**.
This branch addresses the last three, and needs approval because it adds words
to the page.

---

## What this branch proposes to add

Each post gets three new sections, placed **below** Nancy's article, after her
signature and byline:

### 1. A scripture block

The verses she already alludes to, quoted in full with the reference. For
example, the "Cost of Your Silence" post currently quotes *"Death and life are
in the power of the tongue"* without naming it. The addition names it:

> **Proverbs 18:21** — *"Death and life are in the power of the tongue: and they
> that love it shall eat the fruit thereof."* (KJV)

**Why it matters:** 210 people a month search "proverbs 18:21 meaning". Right
now that post cannot appear for any of them, because the reference is not on the
page.

**Translation:** King James, because it is public domain and free to reproduce.
Every verse has its own translation field, so switching to NIV or NKJV is a
one-line change per verse if Nancy prefers.

### 2. A short question-and-answer block

Four questions per post, worded the way people type them into Google, answered
in two to four sentences from within Nancy's own framework. Example, from the
self-worth post:

> **What does the Bible say about self-worth?**
> It grounds worth in creation and in God's valuation, never in performance.
> Genesis 1:27 says you were made in His image, Psalm 139:14 that you were made
> deliberately and well, and Luke 12:7 that God counts you of great value. In
> each case the worth is assigned before anything is achieved.

**Why it matters:** questions are how most people search now, and a page that
answers a question in plain words is what Google lifts into the box at the top
of the results.

**What to check:** these are written *in* her theology but not *by* her. She
should read all 36 and correct anything that does not sound like what she
believes. That is the main thing this document is asking her to do.

### 3. Three links to her own pages

A "Where to go next" row pointing at the quiz, the assessment, the guide, or the
programs page, chosen to match the post's subject.

**Why it matters:** this is the funnel the site already has. The articles simply
never pointed at it.

---

## Effect on length

| Post | Now | Proposed | Still thin? |
|---|---:|---:|---|
| Fear Has a Name | 597 | 976 | |
| You Are Worthy | 558 | 918 | |
| Self-Worth Is Not Self-Confidence | 432 | 789 | |
| Appointed, Not Nominated | 401 | 728 | |
| The Cost of Your Silence | 378 | 725 | |
| You Are the Voice | 346 | 672 | |
| Finding Your V.O.I.C.E. | 218 | 477 | **yes** |
| Permission to Lead | 169 | 461 | **yes** |
| What Your Silence Is Costing You | 122 | 363 | **yes** |
| **Total** | **3,221** | **6,109** | |

## The three short posts still need Nancy, not us

The bottom three are still too short to compete, and this is the one problem
that cannot be solved from the outside.

Her posts are personal testimony — her father the civil rights minister, the
decades of being made to feel disqualified, the specific seasons she came
through. Lengthening those by inventing detail would be making up her life. So
we did not.

What each of the three needs from her is roughly 400–600 words of the same thing
she already does well:

- **Finding Your V.O.I.C.E.** — one real example per letter. A woman (or herself)
  who found Vision, took an Opportunity, and so on. Currently the five elements
  are defined but never shown.
- **Permission to Lead** — the moment she stopped waiting. The post says she
  waited for years and then realised permission had to come from her. The story
  of the day that turned is the missing half.
- **What Your Silence Is Costing You** — this one overlaps heavily with "The Cost
  of Your Silence". **Recommendation: merge the two.** Keep the longer post,
  fold anything unique from the short one into it, and redirect the short URL.
  Two posts competing for the same phrase means neither wins it.

---

## Her own phrases: which ones can carry search traffic

Short answer: her coined phrases are **brand assets, not search terms** — nobody
is typing them yet. But two of the things she says constantly map directly onto
large, winnable searches.

| Her phrase | Uses in her writing | Maps to | Volume / difficulty |
|---|---:|---|---|
| "the renewing of your mind" (Romans 12:2) | 5 | **renewing of the mind** | **720/mo, difficulty 22** |
| "self-worth" as distinct from confidence | 15 | **self worth in the bible** | **590/mo, difficulty 7** |
| "Appointed, not nominated" | 7 | jeremiah 1:5 meaning | 260/mo, difficulty 24 |
| "Use your voice" | 6 | how to find your voice | 170/mo, difficulty 16 |
| "Death and life are in the power of the tongue" | 1 | proverbs 18:21 meaning | 210/mo, difficulty 17 |
| "We rise to the level of our self-worth" | signature line | *no measurable volume* | brand asset |
| "Speak From Purpose", "Divine Mindset", "B.O.L.D. OUT" | brand names | *no measurable volume* | brand asset |

*Volumes from the Semrush US database, September 2026, as cited in the search audit.*

**The finding worth acting on: "renewing of the mind" is the single largest
winnable term in the whole audit at 720 searches a month, and she already writes
about it constantly — five mentions across two posts — but has never given it a
post of its own.** She does not need to learn a new subject to rank for it. She
needs to write the post she has already been writing around.

That is the highest-value next article, and it leads straight into the Divine
Mindset Guide, which is the product it would sell.

The signature lines are worth keeping exactly as they are. They have no search
volume and never will until she has an audience, but they are what makes the
writing hers, and they are what people will search once the book and the
speaking do their work. Do not optimise them away.

---

## What we are asking for

1. **Read the 36 questions and answers.** Correct anything that misstates what
   she believes. This is the only part written in her voice by someone else.
2. **Confirm the King James translation**, or name the one she prefers.
3. **Decide on the merge** of the two silence posts.
4. **Decide whether she wants to write** the missing 400–600 words for the three
   short posts, or leave them short.
5. **Consider a new post on "renewing of the mind."**

If the answer to all of it is no, delete `shared/blogEnrichment.ts` and remove
`<ArticleEnrichment/>` from `client/src/pages/BlogArticle.tsx`. The blog returns
to exactly what it is today, and the technical fixes on the other branch still
stand on their own.
