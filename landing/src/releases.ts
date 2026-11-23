export type Architecture = "x64" | "x86";

export interface Download {
    url: string;
    size: number;
    sha256: string;
}

export interface Release {
    version: string;
    downloads: Partial<Record<Architecture, Download>>;
    notices: { name: string; url: string }[];
    notesURL: string;
}

interface GitHubAsset {
    name: string;
    state: string;
    size: number;
    digest: string | null;
    browser_download_url: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isAsset(value: unknown): value is GitHubAsset {
    return (
        isRecord(value) &&
        typeof value.name === "string" &&
        typeof value.state === "string" &&
        typeof value.size === "number" &&
        (typeof value.digest === "string" || value.digest === null) &&
        typeof value.browser_download_url === "string"
    );
}

export function repositoryPath(repository: string): string {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*\/[a-zA-Z0-9._-]+$/.test(repository)) {
        throw new Error("Invalid release repository");
    }
    return repository;
}

export function normalizeRelease(
    payload: unknown,
    repository: string,
): Release {
    repositoryPath(repository);
    if (
        !isRecord(payload) ||
        payload.draft !== false ||
        payload.prerelease !== false ||
        typeof payload.tag_name !== "string" ||
        !/^v\d+\.\d+\.\d+$/.test(payload.tag_name) ||
        !Array.isArray(payload.assets) ||
        !payload.assets.every(isAsset)
    ) {
        throw new Error("Invalid stable release");
    }
    const assets: GitHubAsset[] = payload.assets;
    const base = `https://github.com/${repository}/releases/download/${payload.tag_name}/`;
    const assetURL = (asset: GitHubAsset): string => {
        const expected = `${base}${encodeURIComponent(asset.name)}`;
        if (
            asset.browser_download_url !== expected ||
            asset.state !== "uploaded"
        ) {
            throw new Error("Invalid asset URL");
        }
        return expected;
    };
    const downloads: Release["downloads"] = {};
    for (const arch of ["x64", "x86"] as const) {
        const asset = assets.find(
            (item) => item.name === `AutoBootController-windows-${arch}.exe`,
        );
        if (!asset) continue;
        if (
            !Number.isSafeInteger(asset.size) ||
            asset.size <= 0 ||
            typeof asset.digest !== "string" ||
            !/^sha256:[a-f0-9]{64}$/.test(asset.digest)
        ) {
            throw new Error("Missing executable checksum or size");
        }
        downloads[arch] = {
            url: assetURL(asset),
            size: asset.size,
            sha256: asset.digest.slice(7),
        };
    }
    const notices = assets
        .filter((item) =>
            /^THIRD-PARTY-NOTICES-windows-(x64|x86)\.txt$/.test(item.name),
        )
        .map((item) => ({ name: item.name, url: assetURL(item) }));
    return {
        version: payload.tag_name.slice(1),
        downloads,
        notices,
        notesURL: `https://github.com/${repository}/releases/tag/${payload.tag_name}`,
    };
}

export async function fetchRelease(
    repository: string,
    signal?: AbortSignal,
): Promise<Release | null> {
    repositoryPath(repository);
    const response = await fetch(
        `https://api.github.com/repos/${repository}/releases/latest`,
        {
            signal,
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Release information unavailable");
    return normalizeRelease(await response.json(), repository);
}
