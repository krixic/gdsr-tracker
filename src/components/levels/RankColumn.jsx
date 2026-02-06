import React from "react";
import { RankCard } from "../RankCard.jsx";
import {
    countCompletedInRank,
    getAllLevels,
    getRankMax,
    getRankStatus,
} from "./levelUtils.js";

export const RankColumn = ({
    rank,
    activeTheme,
    activeRequirements,
    progress,
    attempts,
    showAttempts,
    onToggleRankBulk,
    onCycleLevel,
    onSetDoingValue,
    onSetAttemptsValue,
}) => {
    const allLevels = getAllLevels(rank);
    const completed = countCompletedInRank(rank, progress);
    const requirement = activeRequirements[rank.rank] || 0;
    const max = getRankMax(completed, requirement, allLevels.length);
    const rankStatus = getRankStatus({
        rank,
        progress,
        activeRequirements,
        activeTheme,
    });

    return (
        <div>
            <div
                className={`text-3xl px-4 py-1 text-center border-4 ${rankStatus} transition-all hover:brightness-110 relative`}
                style={{
                    backgroundColor: activeTheme[rank.rank] || "#333",
                }}
                onContextMenu={(e) => onToggleRankBulk(e, rank)}
            >
                <span className="relative z-10">
                    {rank.rank} ({completed}/{max})
                </span>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
                {rank.levels?.map((level) => (
                    <RankCard
                        key={level.id}
                        level={level}
                        progress={progress}
                        attempts={attempts}
                        cycleLevel={onCycleLevel}
                        setDoingValue={onSetDoingValue}
                        setAttemptsValue={onSetAttemptsValue}
                        showAttempts={showAttempts}
                    />
                ))}
                {rank.subranks?.map((sub) => (
                    <div key={sub.rank}>
                        {sub.levels.map((level) => (
                            <RankCard
                                key={level.id}
                                level={level}
                                progress={progress}
                                attempts={attempts}
                                cycleLevel={onCycleLevel}
                                setDoingValue={onSetDoingValue}
                                setAttemptsValue={onSetAttemptsValue}
                                rankColor={activeTheme[sub.rank]}
                                showAttempts={showAttempts}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
