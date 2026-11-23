import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build, createServer } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "dist");
const production = process.env.VERCEL_ENV === "production";
const configuredURL =
    process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
if (production && !configuredURL) {
    throw new Error(
        "Set SITE_URL or enable Vercel system environment variables before a production build.",
    );
}
const site = new URL(
    configuredURL
        ? /^https?:\/\//.test(configuredURL)
            ? configuredURL
            : `https://${configuredURL}`
        : "http://localhost:3000",
);
if (
    site.username ||
    site.password ||
    site.pathname !== "/" ||
    site.search ||
    site.hash ||
    !["https:", "http:"].includes(site.protocol) ||
    (production && site.protocol !== "https:")
) {
    throw new Error(
        "SITE_URL must be a site origin, such as https://your-domain.com, without a path or credentials.",
    );
}
const canonical = `${site.origin}/`;
const escape = (value) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
await build({ root });
const server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
});
let rendered;
try {
    const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
    rendered = render();
} finally {
    await server.close();
}
let html = readFileSync(join(output, "index.html"), "utf8");
html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${rendered}</div>`,
);
const title = "AutoBoot Box | ISP Boot Switching & Windows Controller";
const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1];
const image = new URL("assets/image.png", canonical).href;
const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${canonical}#website`,
            url: canonical,
            name: "AutoBoot Box",
            inLanguage: "en",
        },
        {
            "@type": "WebPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: title,
            description,
            inLanguage: "en",
            isPartOf: { "@id": `${canonical}#website` },
            about: { "@id": `${canonical}#product` },
        },
        {
            "@type": "Product",
            "@id": `${canonical}#product`,
            name: "AutoBoot Box",
            url: canonical,
            description,
            image,
            brand: { "@type": "Brand", name: "AutoBoot" },
        },
    ],
}).replaceAll("<", "\\u003c");
const schemaHash = createHash("sha256").update(schema).digest("base64");
const metadata = [
    `<link rel="canonical" href="${escape(canonical)}">`,
    `<meta name="robots" content="${production ? "index, follow, max-image-preview:large" : "noindex, nofollow"}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="AutoBoot Box">',
    '<meta property="og:locale" content="en_US">',
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${escape(canonical)}">`,
    `<meta property="og:image" content="${escape(image)}">`,
    '<meta property="og:image:width" content="1026">',
    '<meta property="og:image:height" content="693">',
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:alt" content="AutoBoot Controller Windows app for AutoBoot Box ISP boot switching">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escape(title)}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${escape(image)}">`,
    '<meta name="twitter:image:alt" content="AutoBoot Controller Windows app for AutoBoot Box ISP boot switching">',
    `<script type="application/ld+json">${schema}</script>`,
].join("\n  ");
if (!html.includes("<!-- SEO_METADATA -->"))
    throw new Error("Missing SEO metadata insertion point.");
const csp = `default-src 'self'; script-src 'self' 'sha256-${schemaHash}'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'none'; form-action 'none'`;
html = html.replace(
    "<!-- SEO_METADATA -->",
    metadata +
        `\n  <meta http-equiv="Content-Security-Policy" content="${csp}">`,
);

const stylesheet = html.match(
    /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/,
)[1];
writeFileSync(
    join(output, "404.html"),
    readFileSync(join(root, "public/404.html"), "utf8").replace(
        "/styles.css",
        stylesheet,
    ),
);
writeFileSync(join(output, "index.html"), html);
writeFileSync(
    join(output, "robots.txt"),
    production
        ? `User-agent: *\nAllow: /\nSitemap: ${canonical}sitemap.xml\n`
        : "User-agent: *\nDisallow: /\n",
);
writeFileSync(
    join(output, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production ? `<url><loc>${escape(canonical)}</loc></url>` : ""}</urlset>\n`,
);
console.log(
    `Built landing/dist for ${canonical} (${production ? "production, indexable" : "preview, noindex"}).`,
);
