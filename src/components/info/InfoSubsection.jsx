import React from "react";
import { renderTextWithBold } from "./infoUtils.jsx";

const isNoteBlock = (block) =>
    block.startsWith("Note:") || block.startsWith("**Note:**");

const isHeadingBlock = (block) =>
    block.startsWith("**") && block.includes(":**");

const isListBlock = (block) => block.includes("\n- ");

const renderHeadingBlock = (block) => {
    const [heading, ...content] = block.split("\n");
    const headingText = heading
        .replace(/\*\*/g, "")
        .replace(/:$/, "");

    return (
        <div className="mb-5">
            <h4 className="text-lg font-bold text-white mb-3 bg-input px-3 py-2">
                {headingText}
            </h4>
            {content.length > 0 && (
                <div className="ml-4 space-y-2">
                    {content.map((line, lineIdx) => (
                        <p
                            key={lineIdx}
                            className="text-sm text-white/80 leading-relaxed"
                        >
                            {renderTextWithBold(
                                line.replace(/^- /, "- "),
                            )}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

const renderListBlock = (block) => {
    const lines = block.split("\n");
    const intro = lines[0];
    const items = lines.slice(1).filter((line) => line.startsWith("- "));

    return (
        <div className="mb-5">
            {intro && !intro.startsWith("- ") && (
                <p className="mb-3 text-white/90 font-medium">
                    {renderTextWithBold(intro)}
                </p>
            )}
            <ul className="ml-6 space-y-2">
                {items.map((item, itemIdx) => (
                    <li
                        key={itemIdx}
                        className="text-sm text-white/80 list-disc leading-relaxed"
                    >
                        {renderTextWithBold(item.replace(/^- /, ""))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const renderNoteBlock = (block) => (
    <div className="p-4 mb-5 border border-blue-500/30 bg-blue-950/30">
        <p className="text-md text-white/90 leading-relaxed m-0">
            {renderTextWithBold(block)}
        </p>
    </div>
);

export const InfoSubsection = ({ subsection }) => {
    return (
        <div id={subsection.id} className="scroll-mt-8 py-2">
            <h3 className="text-xl font-bold mb-2 text-white">
                {subsection.title}
            </h3>
            {subsection.description && (
                <p className="text-sm text-blue-400 mb-4 font-medium">
                    {subsection.description}
                </p>
            )}
            <div className="text-white/85 leading-relaxed space-y-4">
                {subsection.content.split("\n\n").map((block, idx) => {
                    if (isNoteBlock(block)) {
                        return <div key={idx}>{renderNoteBlock(block)}</div>;
                    }
                    if (isHeadingBlock(block)) {
                        return <div key={idx}>{renderHeadingBlock(block)}</div>;
                    }
                    if (isListBlock(block)) {
                        return <div key={idx}>{renderListBlock(block)}</div>;
                    }
                    return (
                        <p key={idx} className="text-white/85 leading-relaxed">
                            {renderTextWithBold(block)}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};
