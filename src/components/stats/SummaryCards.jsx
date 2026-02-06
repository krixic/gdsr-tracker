import React from "react";

export const SummaryCards = ({
    totalCompleted,
    totalListCompleted,
    totalAttemptsAll,
    showAttempts,
    listLabel,
    mainLabel,
}) => {
    return (
        <div
            className={`grid grid-cols-1 gap-6 ${
                showAttempts ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
        >
            <div className="bg-level p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">Total ({listLabel})</h3>
                </div>
                <div className="text-3xl">{totalCompleted}</div>
            </div>
            <div className="bg-level p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xl font-bold">
                        Grand Total ({mainLabel})
                    </h3>
                </div>
                <div className="text-3xl">{totalListCompleted}</div>
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
