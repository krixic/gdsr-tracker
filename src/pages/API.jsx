import React, { useEffect, useMemo } from "react";
import { apiDocs } from "../docs/api.js";
import { rankRequirements } from "../util.js";
import { ApiSection } from "../components/api/ApiSection.jsx";
import { ApiToc } from "../components/api/ApiToc.jsx";
import {
    formatListsInline,
    formatListsPlain,
} from "../components/api/apiUtils.jsx";

export const API = () => {
    useEffect(() => {
        document.title = "GDSR";
    }, []);

    const availableLists = useMemo(
        () => Object.keys(rankRequirements).sort(),
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
        <div className="flex w-full max-w-[1200px] mx-auto gap-8 px-4 py-8">
            <div className="flex-1 min-w-0">
                {apiDocs.map((section) => (
                    <ApiSection
                        key={section.id}
                        section={section}
                        tokens={listTokens}
                    />
                ))}
            </div>

            <ApiToc apiDocs={apiDocs} />
        </div>
    );
};
