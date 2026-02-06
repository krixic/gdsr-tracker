import React from "react";

export const formatListsInline = (listIds) => {
    if (!listIds || listIds.length === 0) return "";
    const formatted = listIds.map((id) => `\`${id}\``);
    if (formatted.length === 1) return formatted[0];
    return `${formatted.slice(0, -1).join(", ")}, or ${
        formatted[formatted.length - 1]
    }`;
};

export const formatListsPlain = (listIds) => listIds.join(", ");

export const replaceListTokens = (text, tokens) => {
    if (!text) return text;
    return text
        .replaceAll("{listsInline}", tokens.inline)
        .replaceAll("{listsPlain}", tokens.plain);
};

const TOKEN_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export const renderInlineTokens = (text) => {
    const parts = text.split(TOKEN_PATTERN);
    return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code
                    key={idx}
                    className="bg-black/40 px-1.5 py-0.5 text-sm"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        return part;
    });
};

export const applyListTokens = (text, tokens) =>
    replaceListTokens(text, tokens);
