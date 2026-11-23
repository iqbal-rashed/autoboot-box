import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
function build(settings) {
    return spawnSync(process.execPath, ["build.mjs"], {
        cwd: root,
        env: {
            ...process.env,
            SITE_URL: "",
            VERCEL_ENV: "",
            VERCEL_PROJECT_PRODUCTION_URL: "",
            ...settings,
        },
        encoding: "utf8",
    });
}
const output = (file) => readFileSync(join(root, "dist", file), "utf8");

test("production SEO uses the stable domain, valid structured data, and a matching CSP hash", () => {
    const result = build({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "autoboot.example",
    });
    assert.equal(result.status, 0, result.stderr);
    const html = output("index.html");
    assert.match(html, /rel="canonical" href="https:\/\/autoboot\.example\/"/);
    assert.match(
        html,
        /name="robots" content="index, follow, max-image-preview:large"/,
    );
    assert.match(
        html,
        /property="og:image" content="https:\/\/autoboot\.example\/assets\/image\.png"/,
    );
    const schema = html.match(
        /<script type="application\/ld\+json">(.*?)<\/script>/s,
    )[1];
    const graph = JSON.parse(schema)["@graph"];
    assert.equal(
        graph.find((item) => item["@type"] === "Product").name,
        "AutoBoot Box",
    );
    assert.ok(
        html.includes(
            `'sha256-${createHash("sha256").update(schema).digest("base64")}'`,
        ),
    );
    assert.match(
        output("robots.txt"),
        /Allow: \/\nSitemap: https:\/\/autoboot\.example\/sitemap.xml/,
    );
    assert.match(
        output("sitemap.xml"),
        /<loc>https:\/\/autoboot\.example\/<\/loc>/,
    );
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(!html.includes("<!-- SEO_METADATA -->"));
    assert.ok(html.includes("AutoBoot Box."));
    assert.ok(html.includes("Easier ISP"));
    assert.ok(html.includes("View GitHub Releases"));
    assert.ok(!existsSync(join(root, "dist", "src")));
    for (const file of [
        "README.md",
        "package.json",
        "build.mjs",
        "vercel.json",
        ".env",
    ]) {
        assert.ok(
            !existsSync(join(root, "dist", file)),
            `${file} must not be published`,
        );
    }
    assert.ok(existsSync(join(root, "dist/assets/image.png")));
    assert.ok(readdirSync(join(root, "dist")).includes("404.html"));
});

test("previews are noindex and keep canonical links pointed at production", () => {
    const result = build({
        VERCEL_ENV: "preview",
        SITE_URL: "https://custom.example",
        VERCEL_URL: "temporary-preview.vercel.app",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(
        output("index.html"),
        /name="robots" content="noindex, nofollow"/,
    );
    assert.match(
        output("index.html"),
        /rel="canonical" href="https:\/\/custom\.example\/"/,
    );
    assert.equal(output("robots.txt"), "User-agent: *\nDisallow: /\n");
    assert.ok(!output("sitemap.xml").includes("<url>"));
});

test("production fails instead of publishing placeholder or malformed canonical URLs", () => {
    for (const SITE_URL of [
        "",
        "http://autoboot.example",
        "https://autoboot.example/private",
        "https://user:pass@autoboot.example",
    ]) {
        assert.notEqual(
            build({ VERCEL_ENV: "production", SITE_URL }).status,
            0,
            SITE_URL,
        );
    }
});
