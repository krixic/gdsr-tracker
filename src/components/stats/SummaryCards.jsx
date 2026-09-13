import React from "react";

export const SummaryCards = ({
    summaryGroups,
    totalAttemptsAll,
    showAttempts,
}) => {
    return (
        <div
            className={`grid grid-cols-1 gap-6 ${
                showAttempts ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
        >
            <div className="bg-level p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">Totals</h3>
                </div>
                <div className="space-y-4">
                    {summaryGroups.map((group) => (
                        <div key={group.key}>
                            <div className="space-y-1 text-sm">
                                {group.subs.map((sub) => (
                                    <div
                                        key={sub.key}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <span className="text-white/70">
                                            {sub.label} Total
                                        </span>
                                        <span className="text-white">
                                            {sub.completed}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                                <span className="text-white font-bold">
                                    {group.label} Total
                                </span>
                                <span className="text-3xl">{group.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-level p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">Grand Totals</h3>
                </div>
                <div className="space-y-4">
                    {summaryGroups.map((group) => (
                        <div key={group.key}>
                            <div className="space-y-1 text-sm">
                                {group.subs.map((sub) => (
                                    <div
                                        key={sub.key}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <span className="text-white/70">
                                            {sub.label} Grand Total
                                        </span>
                                        <span className="text-white">
                                            {sub.grandCompleted}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                                <span className="text-white font-bold">
                                    {group.label} Grand Total
                                </span>
                                <span className="text-3xl">
                                    {group.grandTotal}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showAttempts && (
                <div className="bg-level p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="text-xl font-bold">Attempts</h3>
                    </div>
                    <div className="text-3xl">{totalAttemptsAll}</div>
                </div>
            )}
        </div>
    );
};
