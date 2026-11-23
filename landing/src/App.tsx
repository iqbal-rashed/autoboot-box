import { Downloads } from "./Downloads.tsx";

export default function App() {
    return (
        <>
            <header className="nav wrap">
                <a className="brand" href="#" aria-label="AutoBoot Box home">
                    <img
                        src="assets/relay-badge.png"
                        width="38"
                        height="38"
                        alt=""
                    />
                    <span>
                        AutoBoot
                        <span className="brand-sub">BOX + CONTROLLER</span>
                    </span>
                </a>
                <nav aria-label="Main navigation">
                    <a href="#features">The box</a>
                    <a href="#setup">How it works</a>
                    <a className="nav-download" href="#downloads">
                        Get the app <span aria-hidden="true">↗</span>
                    </a>
                </nav>
            </header>
            <main id="main-content">
                <section className="hero wrap">
                    <div className="hero-copy">
                        <p className="eyebrow">
                            <span className="dot"></span> A BETTER CONNECTION
                            STARTS HERE
                        </p>
                        <h1>
                            AutoBoot Box.
                            <br />
                            <span>
                                Easier ISP
                                <br />
                                boot switching.
                            </span>
                        </h1>
                        <p className="lead">
                            Make it easier to boot devices into ISP mode.
                            AutoBoot Box handles repetitive boot resistance
                            switching while you work with your F64, EasyJTAG, or
                            MIPI tester.
                        </p>
                        <div className="hero-actions">
                            <a className="button primary" href="#purchase">
                                Get AutoBoot Box{" "}
                                <span aria-hidden="true">↗</span>
                            </a>
                            <a className="text-link" href="#downloads">
                                Download the app{" "}
                                <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                        <p className="hero-meta">
                            AutoBoot Box required <span>·</span> Windows app{" "}
                            <span>·</span> USB connection
                        </p>
                    </div>
                    <figure className="hero-visual">
                        <div className="visual-top">
                            <span className="dot"></span> THE WORKBENCH, UNDER
                            CONTROL{" "}
                            <span className="visual-no">DESKTOP APP</span>
                        </div>
                        <img
                            className="app-image"
                            src="assets/image.png"
                            width="1026"
                            height="693"
                            alt="AutoBoot Controller desktop app with USB connection status, Auto and Manual boot controls, attempt counter, progress, and activity log"
                            fetchPriority="high"
                        />
                        <figcaption className="visual-bottom">
                            <span>ONE BOX. FEWER REPETITIVE STEPS.</span>
                            <span>AUTOBOOT CONTROLLER</span>
                        </figcaption>
                    </figure>
                </section>
                <div className="spec-strip">
                    <div className="wrap specs">
                        <div>
                            <strong>F64</strong>
                            <span>ISP repair workflows</span>
                        </div>
                        <div>
                            <strong>EasyJTAG</strong>
                            <span>ISP repair workflows</span>
                        </div>
                        <div>
                            <strong>MIPI tester</strong>
                            <span>device testing workflows</span>
                        </div>
                        <div>
                            <strong>One box</strong>
                            <span>automated boot switching</span>
                        </div>
                    </div>
                </div>
                <section className="section wrap" id="features">
                    <div className="section-intro">
                        <p className="eyebrow">BUILT FOR THE REPAIR BENCH</p>
                        <h2>
                            Focus on the repair.
                            <br />
                            Let the box switch.
                        </h2>
                        <p>
                            AutoBoot Box helps with the repeated switching
                            involved in getting a device connected to your ISP
                            tool. Your existing tool handles the device work.
                        </p>
                    </div>
                    <div className="feature-grid">
                        <article>
                            <span className="feature-icon" aria-hidden="true">
                                ↻
                            </span>
                            <h3>Automate the boot sequence.</h3>
                            <p>
                                Auto cycles through 0, 10, 22, and 47 Ω so you
                                can try boot conditions without switching each
                                resistance by hand.
                            </p>
                        </article>
                        <article>
                            <span className="feature-icon" aria-hidden="true">
                                ⌁
                            </span>
                            <h3>Work with your ISP tools.</h3>
                            <p>
                                Use the box alongside F64, EasyJTAG, or a MIPI
                                tester in a suitable device setup. Your tool and
                                device still need the correct wiring and
                                settings.
                            </p>
                        </article>
                        <article>
                            <span className="feature-icon" aria-hidden="true">
                                ◎
                            </span>
                            <h3>Keep the connection in reach.</h3>
                            <p>
                                With F64 Ultra log monitoring, a “UFS connected
                                successfully” event holds the last active
                                resistance. Automatic log-based hold is specific
                                to F64 Ultra.
                            </p>
                        </article>
                        <article>
                            <span className="feature-icon" aria-hidden="true">
                                ↗
                            </span>
                            <h3>Control it your way.</h3>
                            <p>
                                Choose Auto or Manual, set a 3, 5, or 10-second
                                duration, and follow your attempts. Compact view
                                leaves more space for your repair software.
                            </p>
                        </article>
                    </div>
                </section>
                <section className="setup-section" id="setup">
                    <div className="wrap">
                        <div className="setup-heading">
                            <p className="eyebrow">
                                FROM YOUR BENCH TO YOUR NEXT BOOT
                            </p>
                            <h2>
                                Connect the box.
                                <br />
                                Start your sequence.
                            </h2>
                        </div>
                        <ol className="steps">
                            <li>
                                <span>01</span>
                                <h3>Get your AutoBoot Box</h3>
                                <p>
                                    The AutoBoot Box is required to use the
                                    controller app. Add it to your repair bench
                                    alongside your existing ISP tool.
                                </p>
                                <a className="text-link" href="#purchase">
                                    Purchase here{" "}
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </li>
                            <li>
                                <span>02</span>
                                <h3>Connect your workbench</h3>
                                <p>
                                    Connect the box to your Windows PC over USB.
                                    Follow the supplied box instructions for the
                                    device-side connections and configure your
                                    ISP tool.
                                </p>
                            </li>
                            <li>
                                <span>03</span>
                                <h3>Choose a mode. Press Start.</h3>
                                <p>
                                    Open AutoBoot Controller, wait for the box
                                    to connect, and choose Auto or Manual. Start
                                    the boot sequence and monitor the device in
                                    your ISP software.
                                </p>
                            </li>
                        </ol>
                        <div className="hardware-note">
                            <span className="note-mark">!</span>
                            <p>
                                <strong>
                                    Follow the wiring guide supplied with your
                                    AutoBoot Box.
                                </strong>{" "}
                                Check your device’s ISP pinout and electrical
                                requirements before connecting. The box assists
                                boot switching; your ISP tool handles detection,
                                reading, and writing.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="purchase-section wrap" id="purchase">
                    <div>
                        <p className="eyebrow">
                            THE HARDWARE BEHIND THE WORKFLOW
                        </p>
                        <h2>
                            Meet your next
                            <br />
                            workbench essential.
                        </h2>
                        <p>
                            Pair AutoBoot Box with the Windows controller and
                            spend less time repeating boot resistance changes.
                            An ISP tool and suitable device wiring are required
                            separately.
                        </p>
                    </div>
                    <div className="purchase-card">
                        <span className="product-label">AUTOBOOT BOX</span>
                        <h3>
                            A small box.
                            <br />A smoother boot workflow.
                        </h3>
                        <p>Hardware required · Windows controller app</p>
                        <a
                            className="button primary purchase-button"
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Purchase on Facebook{" "}
                            <span aria-hidden="true">↗</span>
                        </a>
                        <a className="text-link" href="#downloads">
                            Already have a box? Get the app{" "}
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>
                </section>
                <Downloads />
                <section className="faq wrap">
                    <p className="eyebrow">BEFORE YOU CONNECT</p>
                    <details>
                        <summary>Do I need an AutoBoot Box?</summary>
                        <p>
                            Yes. The download is the Windows controller app. You
                            need an AutoBoot Box to perform boot resistance
                            switching.{" "}
                            <a href="#purchase">See purchase information.</a>
                        </p>
                    </details>
                    <details>
                        <summary>
                            Does AutoBoot Box replace my ISP tool?
                        </summary>
                        <p>
                            No. It assists the boot sequence alongside tools
                            such as F64, EasyJTAG, and MIPI testers. You still
                            use your tool for device detection and supported
                            read, write, or repair operations. Results depend on
                            your device, wiring, and tool setup.
                        </p>
                    </details>
                    <details>
                        <summary>
                            Is automatic connection hold available with every
                            tool?
                        </summary>
                        <p>
                            Automatic log-based hold currently works with F64
                            Ultra when its log reports a successful UFS
                            connection. Auto and Manual switching can run
                            independently of F64. AutoBoot is an independent
                            product and is not affiliated with the tool brands
                            mentioned here.
                        </p>
                    </details>
                    <details>
                        <summary>What happens if USB disconnects?</summary>
                        <p>
                            The app stops the sequence and tries to reconnect.
                            The box releases its outputs after six seconds
                            without commands when running compatible firmware.
                            Press Start again after reconnection to begin a new
                            sequence.
                        </p>
                    </details>
                    <details>
                        <summary>
                            Do I need an account or an internet connection?
                        </summary>
                        <p>
                            The controller works locally over USB. It has no
                            cloud account or telemetry. F64 log monitoring reads
                            local process and log information when available.
                        </p>
                    </details>
                </section>
            </main>
            <footer className="wrap footer">
                <a className="brand" href="#">
                    <img
                        src="assets/relay-badge.png"
                        width="32"
                        height="32"
                        alt=""
                    />
                    <span>
                        AutoBoot
                        <span className="brand-sub">BOX + CONTROLLER</span>
                    </span>
                </a>
                <p>Get connected. Keep repairing.</p>
                <a href="#purchase">
                    Get the box <span aria-hidden="true">↗</span>
                </a>
            </footer>
        </>
    );
}
