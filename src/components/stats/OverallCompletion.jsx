import React from "react";

export const OverallCompletion = ({
    totalCompleted,
    totalCount,
    overallPercent,
}) => {
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between text-sm text-white/80">
                <span>Overall completion</span>
                <span>
                    {totalCompleted}/{totalCount} ({overallPercent}%)
                </span>
            </div>
            <div className="h-6 w-full bg-input/60">
                <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${overallPercent}%` }}
                />
            </div>
        </div>
    );
};
