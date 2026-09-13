import React from "react";
import { creditsContent } from "../docs/credits.js";
import { PageShell } from "../components/PageShell.jsx";
import { usePageTitle } from "../hooks.js";

export const Credits = () => {
    usePageTitle();

    return (
        <PageShell>
            <div className="bg-level p-8">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                    Credits
                </h2>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold mb-4">Data Sources</h3>

                        <div className="space-y-3">
                            {creditsContent.map((credit) => (
                                <div key={credit.title}>
                                    <a
                                        href={credit.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/85 hover:text-white underline underline-offset-2 transition-colors"
                                    >
                                        {credit.title}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="border-t border-white/10 pt-8">
                        <h3 className="text-xl font-bold mb-4">
                            Special Thanks
                        </h3>

                        <p className="text-white/85 leading-relaxed">
                            Special thanks to Scorch, Quad, and nintenfox for
                            helping throughout the development process, and to
                            everyone who uses and supports the site big ups
                            lads.
                        </p>
                    </section>
                </div>
            </div>
        </PageShell>
    );
};
