import React from "react";
import { applyListTokens, renderInlineTokens } from "./apiUtils.jsx";

export const ApiParameter = ({ param, tokens }) => {
    return (
        <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
                <code className="text-blue-400 font-semibold">
                    {param.name}
                </code>
                <span className="text-xs text-white/50">{param.type}</span>
                {param.required ? (
                    <span className="text-xs text-red-400">(required)</span>
                ) : (
                    <span className="text-xs text-white/40">(optional)</span>
                )}
            </div>
            <p className="text-sm text-white/70">
                {renderInlineTokens(
                    applyListTokens(param.description, tokens),
                )}
            </p>
        </div>
    );
};
