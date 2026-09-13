import React from "react";
import { changelogContent } from "../docs/changelog.js";
import { renderChangelogText } from "../utils/richText.jsx";
import { PageShell } from "../components/PageShell.jsx";
import { Toc } from "../components/Toc.jsx";
import { usePageTitle } from "../hooks.js";

export const Changelog = () => {
    usePageTitle();

    return (
        <PageShell
            sidebar={
                <Toc
                    items={changelogContent}
                    labelClassName="block text-sm text-white/70 hover:text-white transition-colors py-1 duration-200 font-medium"
                    renderLabel={(entry) => (
                        <>
                            {entry.title} {"("}
                            {entry.id}
                            {")"}
                        </>
                    )}
                />
            }
        >
            <div className="bg-level p-8">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                    Changelog
                </h2>

                <div className="space-y-8">
                    {changelogContent.map((entry) => (
                        <section
                            key={entry.id}
                            id={entry.id}
                            className="scroll-mt-8 border-b border-white/10 pb-8 last:border-b-0"
                        >
                            <h3 className="text-xl font-bold mb-2">
                                {entry.title}
                            </h3>

                            <p className="text-sm text-white/50 mb-4">
                                {entry.id}
                            </p>

                            <div className="space-y-4 text-white/85 leading-relaxed">
                                {entry.changes.map((change, index) => (
                                    <p key={index}>
                                        {renderChangelogText(change)}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </PageShell>
    );
};
