import { Fragment, useEffect, useState } from "react";
import type { Release, Architecture } from "./releases.ts";
import config from "../site.config.json";
import { fetchRelease } from "./releases.ts";

export function Downloads() {
    const [release, setRelease] = useState<Release | null>(null);
    const [status, setStatus] = useState("Download the latest Windows release.");
    const latestURL = `https://github.com/${config.releaseRepository}/releases/latest`;
    useEffect(() => {
        const controller = new AbortController();
        fetchRelease(config.releaseRepository, controller.signal)
            .then((data) => {
                if (!data) {
                    setStatus("No stable release is available yet. View GitHub Releases for updates.");
                    return;
                }
                setRelease(data);
                const count = Object.keys(data?.downloads || {}).length;
                setStatus(
                    count === 2
                        ? "Both Windows builds are available."
                        : count === 1
                          ? "One Windows build is available. The other is being prepared."
                          : "The Windows release is being prepared. Check back soon.",
                );
            })
            .catch((error) => {
                if (!(error instanceof Error && error.name === "AbortError"))
                    setStatus(
                        "Version details are unavailable. Download links still open the latest GitHub release.",
                    );
            });
        return () => controller.abort();
    }, []);
    return (
        <section className="section wrap downloads-section" id="downloads">
            <div className="section-intro">
                <p className="eyebrow">READY FOR YOUR WORKBENCH</p>
                <h2>
                    Your box.
                    <br />
                    Your control center.
                </h2>
                <p>
                    Download the Windows app for your AutoBoot Box. Connect over
                    USB and manage your boot sequence from one workspace.
                </p>
                <span className="release-label" id="release-version">
                    {release
                        ? `Latest · v${release.version} · Windows`
                        : "Latest release · Windows"}
                </span>
            </div>
            <div className="download-panel">
                <p
                    className="download-status"
                    id="download-status"
                    role="status"
                >
                    {status}
                </p>
                {(["x64", "x86"] as Architecture[]).map((arch) => {
                    const file = release?.downloads[arch];
                    return (
                        <div className="download-row" key={arch}>
                            <div>
                                <h3>
                                    Windows {arch === "x64" ? "64" : "32"}-bit{" "}
                                    {arch === "x64" && (
                                        <span className="recommended">
                                            RECOMMENDED
                                        </span>
                                    )}
                                </h3>
                                <p>
                                    {arch === "x64"
                                        ? "For 64-bit Windows 10 and Windows 11"
                                        : "For 32-bit Windows 10 systems"}
                                </p>
                                <small id={`size-${arch}`}>
                                    {arch} · portable EXE
                                    {file
                                        ? ` · ${(file.size / 1048576).toFixed(1)} MB`
                                        : ""}
                                </small>
                            </div>
                            <a
                                className={`button ${arch === "x64" ? "primary" : "secondary"} download`}
                                id={`download-${arch}`}
                                href={`${latestURL}/download/AutoBootController-windows-${arch}.exe`}
                                aria-label={`Download AutoBoot Controller for Windows ${arch === "x64" ? "64" : "32"}-bit`}
                            >
                                Download <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                    );
                })}
                <div className="download-foot">
                    <span>
                        Check Settings → System → About for your system type.
                    </span>
                    <a
                        href={latestURL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View GitHub Releases ↗
                    </a>
                </div>
                <details>
                    <summary>Verify your download</summary>
                    <p>
                        Compare the SHA-256 value below using{" "}
                        <code>
                            Get-FileHash .\AutoBootController-windows-x64.exe
                            -Algorithm SHA256
                        </code>{" "}
                        in PowerShell. A checksum checks file integrity. Check
                        Windows file properties for publisher signature details.
                    </p>
                    <div id="checksums">
                        {Object.entries(release?.downloads || {}).length
                            ? Object.entries(release?.downloads || {}).map(
                                  ([arch, file]) => (
                                      <Fragment key={arch}>
                                          <strong>
                                              Windows {arch} · v{release?.version} — SHA-256
                                          </strong>
                                          <code>{file.sha256}</code>
                                      </Fragment>
                                  ),
                              )
                            : "Open GitHub Releases for the latest checksums while version details are unavailable."}
                    </div>
                </details>
                <p className="signature-note">
                    Downloads are hosted on GitHub Releases. Check the release
                    notes and publisher before running an executable.
                </p>
                {release?.notices.map((notice) => (
                    <p key={notice.name}>
                        <a className="text-link" href={notice.url}>
                            {notice.name}
                        </a>
                    </p>
                ))}
                <noscript>
                    <p>
                        Open{" "}
                        <a
                            href={latestURL}
                        >
                            GitHub Releases
                        </a>{" "}
                        to download the Windows app without JavaScript.
                    </p>
                </noscript>
            </div>
        </section>
    );
}
