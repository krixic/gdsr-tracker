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

export const applyListTokens = (text, tokens) =>
    replaceListTokens(text, tokens);
