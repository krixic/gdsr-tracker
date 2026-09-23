import React from "react";
import { RankCard } from "../RankCard.jsx";
import {
    countCompletedInRank,
    getAllLevels,
    getRankMax,
    getRankStatus,
} from "../../utils/rankLevels.js";
import { getContrastTextColor, getLevelKey } from "../../util.js";

export const RankColumn = ({
    rank,
    activeTheme,
    progress,
    attempts,
    showAttempts,
    duplicateIds,
    onToggleRankBulk,
    onCycleLevel,
    onSetDoingValue,
    onSetAttemptsValue,
}) => {
    const allLevels = getAllLevels(rank);
    const completed = countCompletedInRank(rank, progress, duplicateIds);
    const requirement = rank.requirement || 0;
    const max = getRankMax(
        completed,
        requirement,
        allLevels.length,
        rank.excludeFromTotal,
    );
    const excludedRankText = rank.excludeFromTotal
        ? "text-xl text-white/90 italic font-normal leading-none"
        : "";
    const rankBorder = getRankStatus({
        rank,
        progress,
        activeTheme,
        duplicateIds,
    });
    const rankLabel = rank.rank ?? rank.name;
    const subranks = rank.ranks ?? rank.subranks;
    const headerColor = rank.headerColor
        ? `#${rank.headerColor.replace("#", "")}`
        : activeTheme[rankLabel] || "#333";

    return (
        <div>
            <div
                className={`h-[52px] text-3xl px-4 py-1 text-center border-4 ${rankBorder.className} transition-all hover:brightness-110 relative flex items-center justify-center`}
                style={{
                    backgroundColor: headerColor,
                    color: getContrastTextColor(headerColor),
                    ...rankBorder.style,
                }}
                onContextMenu={(e) => onToggleRankBulk(e, rank)}
            >
                <span className={`relative z-10 ${excludedRankText}`}>
                    {rankLabel} ({completed}/{max})
                </span>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
                {rank.levels?.map((level) => (
                    <RankCard
                        key={getLevelKey(level, duplicateIds)}
                        level={level}
                        progress={progress}
                        attempts={attempts}
                        duplicateIds={duplicateIds}
                        cycleLevel={onCycleLevel}
                        setDoingValue={onSetDoingValue}
                        setAttemptsValue={onSetAttemptsValue}
                        showAttempts={showAttempts}
                    />
                ))}
                {subranks?.map((sub) => (
                    <div key={sub.rank}>
                        {sub.levels.map((level) => (
                            <RankCard
                                key={getLevelKey(level, duplicateIds)}
                                level={level}
                                progress={progress}
                                attempts={attempts}
                                duplicateIds={duplicateIds}
                                cycleLevel={onCycleLevel}
                                setDoingValue={onSetDoingValue}
                                setAttemptsValue={onSetAttemptsValue}
                                rankColor={activeTheme[sub.rank]}
                                rankLabel={sub.rank}
                                showAttempts={showAttempts}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
