import React from "react";
import { renderTextWithBold } from "../../utils/richText.jsx";
import { InfoSubsection } from "./InfoSubsection.jsx";

const renderContent = (content) => (
    <div className="prose prose-invert max-w-none mb-6">
        {content.split("\n\n").map((block, idx) => {
            const lines = block.split("\n");
            const isList = lines.some((line) => line.startsWith("- "));

            if (isList) {
                const intro = lines[0].startsWith("- ") ? null : lines[0];
                const items = lines
                    .filter((line) => line.startsWith("- "))
                    .map((line) => line.replace(/^- /, ""));

                return (
                    <div key={idx} className="mb-4">
                        {intro && (
                            <p className="mb-3 text-white/90 text-base leading-relaxed">
                                {renderTextWithBold(intro)}
                            </p>
                        )}

                        <ul className="ml-6 list-disc space-y-2">
                            {items.map((item, itemIdx) => (
                                <li
                                    key={itemIdx}
                                    className="text-white/90 text-base leading-relaxed"
                                >
                                    {renderTextWithBold(item)}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }

            return (
                <p
                    key={idx}
                    className="mb-4 text-white/90 text-base leading-relaxed"
                >
                    {renderTextWithBold(block)}
                </p>
            );
        })}
    </div>
);

export const InfoSection = ({ section }) => {
    return (
        <div id={section.id} className="bg-level p-8 mb-8 scroll-mt-8">
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10">
                {section.title}
            </h2>

            {section.content && renderContent(section.content)}

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
