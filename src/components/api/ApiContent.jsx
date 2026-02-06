import React from "react";
import { applyListTokens, renderInlineTokens } from "./apiUtils.jsx";

const isNoteBlock = (block) =>
    block.startsWith("Note:") || block.startsWith("**Note:**");

const isListBlock = (block) =>
    block.startsWith("- ") || block.includes("\n- ");

const renderNoteBlock = (block) => (
    <div className="p-4 mb-5 border border-blue-500/30 bg-blue-950/30">
        <p className="text-md text-white/90 leading-relaxed m-0">
            {renderInlineTokens(block)}
        </p>
    </div>
);

const renderListBlock = (block) => {
    const lines = block.split("\n");
    const intro = lines[0];
    const items = lines.filter((line) => line.startsWith("- "));

    return (
        <div className="mb-5">
            {intro && !intro.startsWith("- ") && (
                <p className="mb-3 text-white/90 font-medium">
                    {renderInlineTokens(intro)}
                </p>
            )}
            <ul className="ml-6 space-y-2">
                {items.map((item, idx) => (
                    <li
                        key={idx}
                        className="text-sm text-white/80 list-disc leading-relaxed"
                    >
                        {renderInlineTokens(item.replace(/^- /, ""))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const ApiContent = ({ content, tokens }) => {
    if (!content) return null;
    const withTokens = applyListTokens(content, tokens);
    const blocks = withTokens.split("\n\n");

    return (
        <div className="prose prose-invert max-w-none mb-6">
            {blocks.map((block, idx) => {
                if (isNoteBlock(block)) {
                    return <div key={idx}>{renderNoteBlock(block)}</div>;
                }
                if (isListBlock(block)) {
                    return <div key={idx}>{renderListBlock(block)}</div>;
                }
                return (
                    <p key={idx} className="mb-4 text-white/90 text-base">
                        {renderInlineTokens(block)}
                    </p>
                );
            })}
        </div>
    );
};
