import React from "react";
import { getContrastTextColor, getLevelKey } from "../../util.js";
import {
    getAllLevels,
    sumAttempts,
    hexToRgba,
} from "../../utils/rankLevels.js";

export const RanksGrid = ({
    activeList,
    activeColors,
    progress,
    attempts,
    settings,
    duplicateIds,
}) => {
    return (
        <div className="bg-level p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Ranks</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {activeList.levels.map((rank) => {
                    const rankLabel = rank.rank ?? rank.name;
                    const levels = getAllLevels(rank);
                    const completed = levels.filter(
                        (level) =>
                            progress[getLevelKey(level, duplicateIds)] === 100,
                    ).length;
                    const requirement = rank.requirement || 0;
                    const requirementMet = rank.excludeFromTotal
                        ? completed === levels.length
                        : completed >= requirement;
                    const completionPercent =
                        levels.length > 0
                            ? Math.round((completed / levels.length) * 100)
                            : 0;
                    const attemptsTotal = sumAttempts(
                        levels,
                        attempts,
                        duplicateIds,
                    );
                    const rankColor = rank.headerColor
                        ? `#${rank.headerColor.replace("#", "")}`
                        : activeColors[rankLabel];
                    const nestedRanks = rank.ranks ?? rank.subranks;
                    const isPlusPossible =
                        !nestedRanks || nestedRanks.length === 0;
                    const isPlus =
                        !rank.noPlusRanks &&
                        isPlusPossible &&
                        levels.length > 0 &&
                        completed === levels.length;
                    const showRequirementPanel =
                        !requirementMet && requirement > 0;
                    const showRankPlusPanel =
                        requirementMet && isPlusPossible && !isPlus;
                    const showAttemptsPanel = settings.showAttempts;
                    const showAttemptsRight =
                        showAttemptsPanel && showRequirementPanel;
                    const showAttemptsLeft =
                        showAttemptsPanel &&
                        !showRequirementPanel &&
                        !showRankPlusPanel;

                    return (
                        <div
                            key={rankLabel}
                            className="border-4 border-white/10 p-4"
                            style={{
                                backgroundColor: hexToRgba(rankColor, 0.5),
                                borderColor: hexToRgba(rankColor),
                            }}
                        >
                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div
                                    className={`${
                                        isPlus
                                            ? "text-xl font-bold not-italic"
                                            : requirementMet
                                              ? "text-lg font-normal not-italic"
                                              : "text-base font-normal italic"
                                    }`}
                                    style={{
                                        color: getContrastTextColor(rankColor),
                                    }}
                                >
                                    {rankLabel}
                                    {isPlus ? "+" : ""}
                                </div>
                                <div className="text-sm text-white/70">
                                    {completed}/{levels.length} completed
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {showRequirementPanel ? (
                                    <div className="bg-black/15 px-3 py-3 whitespace-normal break-words leading-snug order-1 min-h-[64px] flex flex-col justify-center">
                                        <div className="text-xs uppercase tracking-wide text-white/50">
                                            To Rank
                                        </div>
                                        <div className="text-white/90">
                                            {Math.min(
                                                100,
                                                Math.round(
                                                    (completed / requirement) *
                                                        100,
                                                ),
                                            )}
                                            % ({completed}/{requirement})
                                        </div>
                                    </div>
                                ) : showRankPlusPanel ? (
                                    <div className="bg-black/15 px-3 py-3 order-1 min-h-[64px] flex flex-col justify-center">
                                        <div className="text-xs uppercase tracking-wide text-white/50">
                                            To Rank+
                                        </div>
                                        <div className="text-white/90">
                                            {completionPercent}% ({completed}/
                                            {levels.length})
                                        </div>
                                    </div>
                                ) : showAttemptsLeft ? (
                                    <div className="bg-black/15 px-3 py-3 order-1 min-h-[64px] flex flex-col justify-center">
                                        <div className="text-xs uppercase tracking-wide text-white/50">
                                            Attempts
                                        </div>
                                        <div className="text-white/90">
                                            {attemptsTotal}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-black/15 px-3 py-3 invisible order-1 min-h-[64px]" />
                                )}
                                {showAttemptsRight ? (
                                    <div className="bg-black/15 px-3 py-3 order-2 min-h-[64px] flex flex-col justify-center">
                                        <div className="text-xs uppercase tracking-wide text-white/50">
                                            Attempts
                                        </div>
                                        <div className="text-white/90">
                                            {attemptsTotal}
                                        </div>
                                    </div>
                                ) : showRankPlusPanel && showAttemptsPanel ? (
                                    <div className="bg-black/15 px-3 py-3 order-2 min-h-[64px] flex flex-col justify-center">
                                        <div className="text-xs uppercase tracking-wide text-white/50">
                                            Attempts
                                        </div>
                                        <div className="text-white/90">
                                            {attemptsTotal}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-black/15 px-3 py-3 invisible order-2 min-h-[64px]" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
