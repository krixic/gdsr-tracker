import React from "react";
import { hexToRgba } from "./statsUtils.js";

export const CompletedRanks = ({ completedRanks, activeColors }) => {
    return (
        <div className="bg-level p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold">Completed Ranks</h3>
            </div>
            {completedRanks.length === 0 ? (
                <p className="text-sm text-white/70">No ranks completed</p>
            ) : (
                <div className="flex flex-wrap gap-2 text-sm">
                    {completedRanks.map((rankLabel) => {
                        const baseRank = rankLabel.replace("+", "");
                        const rankColor = activeColors[baseRank];
                        const isPlusRank = rankLabel.endsWith("+");
                        return (
                            <span
                                key={rankLabel}
                                className={`px-3 py-1 border border-white/10 ${
                                    isPlusRank ? "font-bold tracking-wide" : ""
                                }`}
                                style={{
                                    backgroundColor: hexToRgba(rankColor, 0.5),
                                }}
                            >
                                {isPlusRank ? `${rankLabel}` : rankLabel}
                            </span>
                        );
                    })}
                </div>
            )}

        </div>
    );
};
