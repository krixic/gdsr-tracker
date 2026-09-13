import React from "react";
import { infoContent } from "../docs/info.js";
import { InfoSection } from "../components/info/InfoSection.jsx";
import { PageShell } from "../components/PageShell.jsx";
import { Toc } from "../components/Toc.jsx";
import { usePageTitle } from "../hooks.js";

export const Info = () => {
    usePageTitle();

    return (
        <PageShell
            sidebar={
                <Toc
                    items={infoContent}
                    labelClassName="block text-sm text-white/70 hover:text-white transition-colors py-1 duration-200 font-medium"
                    getChildren={(section) => section.sections}
                    childListClassName="ml-3 mt-1 space-y-1 border-l-2 border-white/10 pl-3"
                    childLabelClassName="block text-xs text-white/60 transition-colors py-1"
                />
            }
        >
            {infoContent.map((section) => (
                <InfoSection key={section.id} section={section} />
            ))}
        </PageShell>
    );
};
