import assert from "node:assert/strict";
import test from "node:test";
import { fetchRelease, normalizeRelease, repositoryPath } from "./releases.ts";

const repository = "iqbal-rashed/autoboot-box";
const release = () => ({
    tag_name: "v1.1.0",
    draft: false,
    prerelease: false,
    assets: ["x64", "x86"].map((arch) => ({
        name: `AutoBootController-windows-${arch}.exe`,
        state: "uploaded",
        size: 100,
        digest: `sha256:${"a".repeat(64)}`,
        browser_download_url: `https://github.com/${repository}/releases/download/v1.1.0/AutoBootController-windows-${arch}.exe`,
    })),
});

test("stable release maps EXEs and GitHub SHA-256 digests into downloads", () => {
    const data = normalizeRelease(release(), repository);
    assert.equal(data.version, "1.1.0");
    assert.equal(data.downloads.x64.sha256, "a".repeat(64));
    assert.equal(data.downloads.x86.size, 100);
    assert.equal(
        data.notesURL,
        `https://github.com/${repository}/releases/tag/v1.1.0`,
    );
});
test("rejects untrusted URLs, missing digests, drafts, and prereleases", () => {
    for (const mutate of [
        (data) => {
            data.assets[0].browser_download_url =
                "https://evil.example/app.exe";
        },
        (data) => {
            data.assets[0].digest = null;
        },
        (data) => {
            data.draft = true;
        },
        (data) => {
            data.prerelease = true;
        },
    ]) {
        const data = release();
        mutate(data);
        assert.throws(() => normalizeRelease(data, repository));
    }
    assert.throws(() => repositoryPath("../private/repo"));
});
test("no stable release is a normal empty state; API errors remain errors", async (t) => {
    t.mock.method(globalThis, "fetch", async () => ({ status: 404 }));
    assert.equal(await fetchRelease(repository), null);
    globalThis.fetch.mock.mockImplementation(async () => ({
        status: 403,
        ok: false,
    }));
    await assert.rejects(fetchRelease(repository));
});
