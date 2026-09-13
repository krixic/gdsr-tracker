import React from "react";

const BOLD_ONLY = /(\*\*.*?\*\*)/g;
const BOLD_OR_CODE = /(\*\*[^*]+\*\*|`[^`]+`)/g;
const MARKDOWN_LINK = /(\[.*?\]\(https?:\/\/.*?\))/g;

export const renderTextWithBold = (text) => {
    const parts = text.split(BOLD_ONLY);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

export const renderInlineTokens = (text) => {
    const parts = text.split(BOLD_OR_CODE);
    return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code key={idx} className="bg-black/40 px-1.5 py-0.5 text-sm">
                    {part.slice(1, -1)}
                </code>
            );
        }
        return part;
    });
};

export const renderChangelogText = (text) => {
    const parts = text.split(MARKDOWN_LINK);

    return parts.map((part, i) => {
        const match = part.match(/^\[(.*?)\]\((https?:\/\/.*?)\)$/);

        if (match) {
            return (
                <a
                    key={i}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white transition-colors"
                >
                    {match[1]}
                </a>
            );
        }

        return part;
    });
};

export const isNoteBlock = (block) =>
    block.startsWith("Note:") || block.startsWith("**Note:**");

export const renderNoteBlock = (block, renderInline) => (
    <div className="p-4 mb-5 border border-blue-500/30 bg-blue-950/30">
        <p className="text-md text-white/90 leading-relaxed m-0">
            {renderInline(block)}
        </p>
    </div>
);
