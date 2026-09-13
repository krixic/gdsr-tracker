import React, { useMemo } from "react";
import { apiDocs } from "../docs/api.js";
import { listConfigs } from "../data/listConfig.js";
import { ApiSection } from "../components/api/ApiSection.jsx";
import { PageShell } from "../components/PageShell.jsx";
import { Toc } from "../components/Toc.jsx";
import {
    formatListsInline,
    formatListsPlain,
} from "../components/api/apiUtils.js";
import { usePageTitle } from "../hooks.js";

export const API = () => {
    usePageTitle();

    const availableLists = useMemo(
        () => listConfigs.map((config) => config.key).sort(),
        [],
    );
    const listTokens = useMemo(
        () => ({
            inline: formatListsInline(availableLists),
            plain: formatListsPlain(availableLists),
        }),
        [availableLists],
    );

    return (
        <PageShell
            sidebar={
                <Toc
                    items={apiDocs}
                    labelClassName="block text-sm text-white/70 hover:text-white transition-colors py-1 duration-200"
                    getChildren={(section) => section.sections}
                    childListClassName="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3"
                    childLabelClassName="block text-xs text-white/60 hover:text-white/90 transition-colors py-0.5"
                />
            }
        >
            {apiDocs.map((section) => (
                <ApiSection
                    key={section.id}
                    section={section}
                    tokens={listTokens}
                />
            ))}
        </PageShell>
    );
};
