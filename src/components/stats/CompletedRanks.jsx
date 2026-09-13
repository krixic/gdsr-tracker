import React from "react";
import { getContrastTextColor } from "../../util.js";
import { hexToRgba } from "../../utils/rankLevels.js";

export const CompletedRanks = ({ completedRanks }) => {
    return (
        <div className="bg-level p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold">Completed Ranks</h3>
            </div>
            {completedRanks.length === 0 ? (
                <p className="text-sm text-white/70">No ranks completed</p>
            ) : (
                <div className="flex flex-wrap gap-2 text-sm">
                    {completedRanks.map(({ label, color }) => {
                        const isPlusRank = label.endsWith("+");
                        return (
                            <span
                                key={label}
                                className={`px-3 py-1 ${
                                    isPlusRank ? "font-bold tracking-wide" : ""
                                }`}
                                style={{
                                    backgroundColor: hexToRgba(color, 0.5),
                                    color: getContrastTextColor(color),
                                }}
                            >
                                {label}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
