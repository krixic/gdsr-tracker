import React from "react";
import { applyListTokens, renderInlineTokens } from "./apiUtils.jsx";

export const ApiField = ({ field, tokens }) => {
    return (
        <div className="border-l-2 border-white/20 pl-4 py-2">
            <div className="flex items-baseline gap-2">
                <code className="text-blue-400 font-semibold">
                    {field.name}
                </code>
                <span className="text-xs text-white/50">{field.type}</span>
                {field.optional && (
                    <span className="text-xs text-yellow-400">(optional)</span>
                )}
            </div>
            <p className="text-sm text-white/70 mt-1">
                {renderInlineTokens(
                    applyListTokens(field.description, tokens),
                )}
            </p>
        </div>
    );
};
