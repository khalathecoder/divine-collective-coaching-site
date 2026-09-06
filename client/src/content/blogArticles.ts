/**
 * Article content moved to shared/blogArticles.ts so the Express server can read
 * it too -- it needs the titles and dates to build /sitemap.xml and the
 * BlogPosting JSON-LD that goes into the HTML shell.
 *
 * This re-export keeps every existing `@/content/blogArticles` import working.
 */
export type { BlogArticle } from "@shared/blogArticles";
export {
  currentArticles,
  pastArticles,
  allArticles,
  getArticleById,
} from "@shared/blogArticles";
