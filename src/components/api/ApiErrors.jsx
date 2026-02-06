import React from "react";
import { applyListTokens, renderInlineTokens } from "./apiUtils.jsx";

export const ApiErrors = ({ errors, tokens }) => {
    if (!errors || errors.length === 0) return null;

    return (
        <div className="space-y-4">
            {errors.map((error, idx) => (
                <div
                    key={idx}
                    className="border-l-4 border-red-500/50 bg-red-950/20 p-4-r py-1"
                >
                    <div className="flex items-baseline gap-3 mb-2 ml-2">
                        <span className="text-red-400 font-bold">
                            {error.code}
                        </span>
                        <span className="text-white font-semibold">
                            {error.name}
                        </span>
                    </div>
                    <p className="text-sm text-white/70 ml-2">
                        {renderInlineTokens(
                            applyListTokens(error.description, tokens),
                        )}
                    </p>
                </div>
            ))}
        </div>
    );
};
