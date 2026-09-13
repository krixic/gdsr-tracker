import React from "react";
import { rankColors, getLevelKey } from "../util.js";
import { AppToaster } from "./AppToaster.jsx";
import { RankColumn } from "./levels/RankColumn.jsx";
import { getAllLevels, migrateProgressKeys } from "../utils/rankLevels.js";
import { allLevels, duplicateLevelIds } from "../data/listConfig.js";
import { usePersistedState, usePolledStorage, useToastLimit } from "../hooks.js";

export const Levels = ({ levels, type = "gdsr" }) => {
    const activeTheme = rankColors[type] || {};
    const [progress, setProgress] = usePersistedState(
        "progress",
        {},
        (data) => migrateProgressKeys(data, allLevels),
    );
    const [attempts, setAttempts] = usePersistedState(
        "attempts",
        {},
        (data) => migrateProgressKeys(data, allLevels),
    );
    const settings = usePolledStorage("settings", { showAttempts: false });

    useToastLimit();

    const cycleLevel = (levelKey) => {
        setProgress((prev) => {
            const next = { ...prev };
            if (!(levelKey in next)) next[levelKey] = 0;
            else if (next[levelKey] < 100) next[levelKey] = 100;
            else delete next[levelKey];
            return next;
        });
    };

    const setDoingValue = (levelKey, value, forceComplete = false) => {
        const v = forceComplete ? 100 : Math.min(100, Math.max(1, value));
        setProgress((prev) => ({ ...prev, [levelKey]: v }));
    };

    const setAttemptsValue = (levelKey, value) => {
        if (value === 0 || value === "") {
            setAttempts((prev) => {
                const next = { ...prev };
                delete next[levelKey];
                return next;
            });
        } else {
            setAttempts((prev) => ({ ...prev, [levelKey]: value }));
        }
    };

    const toggleRankBulk = (e, rank) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const rankLevels = getAllLevels(rank);
        setProgress((prev) => {
            const next = { ...prev };
            const allCompleted = rankLevels.every(
                (lvl) => prev[getLevelKey(lvl, duplicateLevelIds)] === 100,
            );

            if (allCompleted) {
                rankLevels.forEach(
                    (lvl) => delete next[getLevelKey(lvl, duplicateLevelIds)],
                );
            } else {
                rankLevels.forEach(
                    (lvl) => (next[getLevelKey(lvl, duplicateLevelIds)] = 100),
                );
            }

            return next;
        });
    };

    return (
        <>
            <AppToaster />
            <div
                className={`max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 ${settings.showAttempts ? "gap-8" : "gap-10"} p-4 select-none`}
            >
                {levels.map((rank) => (
                    <RankColumn
                        key={rank.rank ?? rank.name}
                        rank={rank}
                        activeTheme={activeTheme}
                        progress={progress}
                        attempts={attempts}
                        showAttempts={settings.showAttempts}
                        duplicateIds={duplicateLevelIds}
                        onToggleRankBulk={toggleRankBulk}
                        onCycleLevel={cycleLevel}
                        onSetDoingValue={setDoingValue}
                        onSetAttemptsValue={setAttemptsValue}
                    />
                ))}
            </div>
        </>
    );
};
