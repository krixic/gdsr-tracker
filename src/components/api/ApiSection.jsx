import React from "react";
import { ApiContent } from "./ApiContent.jsx";
import { ApiEndpoint } from "./ApiEndpoint.jsx";
import { ApiErrors } from "./ApiErrors.jsx";
import { ApiObjectSection } from "./ApiObjectSection.jsx";

export const ApiSection = ({ section, tokens }) => {
    return (
        <div
            id={section.id}
            className="bg-level p-8 mb-8 scroll-mt-8"
        >
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                {section.title}
            </h2>

            <ApiContent content={section.content} tokens={tokens} />

            {section.sections && (
                <div className="space-y-8">
                    {section.sections.map((subsection) =>
                        subsection.fields ? (
                            <ApiObjectSection
                                key={subsection.id}
                                subsection={subsection}
                                tokens={tokens}
                            />
                        ) : (
                            <ApiEndpoint
                                key={subsection.id}
                                section={subsection}
                                tokens={tokens}
                            />
                        ),
                    )}
                </div>
            )}

            <ApiErrors errors={section.errors} tokens={tokens} />
        </div>
    );
};
