import React from "react";
import { hexToRgba } from "./statsUtils.js";

export const InProgressLevels = ({ inProgressLevels }) => {
    return (
        <div className="bg-level p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold">In Progress</h3>
            </div>
            {inProgressLevels.length === 0 ? (
                <p className="text-sm text-white/70">No in-progress levels</p>
            ) : (
                <div className="flex flex-wrap gap-2 text-sm">
                    {inProgressLevels.map((level) => (
                        <span
                            key={level.id}
                            className="px-3 py-1 border border-white/10"
                            style={{
                                backgroundColor: hexToRgba(
                                    level.rankColor,
                                    0.45,
                                ),
                            }}
                        >
                            {level.name} {level.progress}%
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
