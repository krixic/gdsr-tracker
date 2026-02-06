import React from "react";
import { renderTextWithBold } from "./infoUtils.jsx";
import { InfoSubsection } from "./InfoSubsection.jsx";

const renderParagraphs = (content) => (
    <div className="prose prose-invert max-w-none mb-6">
        {content.split("\n\n").map((paragraph, idx) => (
            <p
                key={idx}
                className="mb-4 text-white/90 text-base leading-relaxed"
            >
                {renderTextWithBold(paragraph)}
            </p>
        ))}
    </div>
);

export const InfoSection = ({ section }) => {
    return (
        <div
            id={section.id}
            className="bg-level p-8 mb-8 scroll-mt-8"
        >
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                {section.title}
            </h2>

            {section.content && renderParagraphs(section.content)}

            {section.sections && (
                <div className="space-y-8">
                    {section.sections.map((subsection) => (
                        <InfoSubsection
                            key={subsection.id}
                            subsection={subsection}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
