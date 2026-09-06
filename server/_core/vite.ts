import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { injectSeoIntoHtml, isUnknownRoute } from "./seo";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      // Same per-route metadata and 404 semantics as production, so SEO
      // problems show up in development rather than only after deploy.
      const html = injectSeoIntoHtml(page, url);
      const status = isUnknownRoute(url) ? 404 : 200;
      res.status(status).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // index:false is required. With the default, express.static would answer "/"
  // with the raw index.html and skip the SEO injection below, leaving the
  // homepage on the generic fallback title.
  app.use(express.static(distPath, { index: false }));

  const templatePath = path.resolve(distPath, "index.html");
  // Read once at startup; the built shell does not change while the server runs.
  const template = fs.existsSync(templatePath)
    ? fs.readFileSync(templatePath, "utf-8")
    : "";

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    if (!template) {
      res.status(500).type("text/plain").send("Client build is missing.");
      return;
    }

    const url = req.originalUrl;
    const html = injectSeoIntoHtml(template, url);
    const status = isUnknownRoute(url) ? 404 : 200;
    res.status(status).set({ "Content-Type": "text/html" }).send(html);
  });
}
