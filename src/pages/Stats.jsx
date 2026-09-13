import React, { useMemo, useState } from "react";
import {
    getListPathLabels,
    listConfigs,
    getListTree,
    allLevels,
    duplicateLevelIds,
} from "../data/listConfig.js";
import { getLevelKey, rankColors } from "../util.js";
import { OverallCompletion } from "../components/stats/OverallCompletion.jsx";
import { RanksGrid } from "../components/stats/RanksGrid.jsx";
import { CompletedRanks } from "../components/stats/CompletedRanks.jsx";
import { SummaryCards } from "../components/stats/SummaryCards.jsx";
import { InProgressLevels } from "../components/stats/InProgressLevels.jsx";
import { ListDropdown } from "../components/ListDropdown.jsx";
import { PageShell } from "../components/PageShell.jsx";
import {
    getAllLevels,
    getCountedLevels,
    sumAttempts,
    migrateProgressKeys,
} from "../utils/rankLevels.js";
import { usePolledStorage, usePageTitle } from "../hooks.js";

const groupConfigs = [
    {
        key: "gdsr-wave",
        label: "GDSR Wave",
        configs: ["gdsr", "dlc"],
    },
    {
        key: "gdsr-ship",
        label: "GDSR Ship",
        configs: ["ship", "shipDlc"],
    },
    {
        key: "ccpl",
        label: "CCPL",
        configs: ["ccpl", "ccplTiny", "ccplConsistency", "ccplSecret"],
    },
    {
        key: "dl",
        label: "DL",
        configs: ["nlw", "lw"],
    },
];

const EMPTY_OBJECT = Object.freeze({});

const listByKey = listConfigs.reduce(
    (lists, config) => ({
        ...lists,
        [config.key]: config,
    }),
    {},
);

const findListByPath = (path) => {
    const config = listConfigs.find((item) => item.path === path);
    return config?.key ?? "gdsr";
};

const loadLastSelection = () => {
    const lastPage = localStorage.getItem("lastPage") || "/";
    return findListByPath(lastPage);
};

export const Stats = () => {
    const progress = usePolledStorage("progress", {}, (data) =>
        migrateProgressKeys(data, allLevels),
    );
    const attempts = usePolledStorage("attempts", {}, (data) =>
        migrateProgressKeys(data, allLevels),
    );
    const settings = usePolledStorage("settings", { showAttempts: false });
    const [selectedListKey, setSelectedListKey] = useState(loadLastSelection);

    usePageTitle();

    const activeConfig = listByKey[selectedListKey] ?? listByKey.gdsr;
    const listTree = useMemo(
        () => getListTree(Boolean(settings.showDemons)),
        [settings.showDemons],
    );
    const activePathLabels = useMemo(
        () => getListPathLabels(activeConfig),
        [activeConfig],
    );
    // const selectedRoot = activePathLabels[0];
    const activeLevels = activeConfig.levels;
    const activeType = activeConfig.type;
    const activeList = useMemo(
        () => ({
            label: activePathLabels.join(" "),
            levels: activeLevels,
            type: activeType,
        }),
        [activeLevels, activePathLabels, activeType],
    );
    const activeColors = rankColors[activeType] ?? EMPTY_OBJECT;

    const grandLevels = useMemo(
        () => activeLevels.flatMap(getAllLevels),
        [activeLevels],
    );
    const countedLevels = useMemo(
        () => activeLevels.flatMap(getCountedLevels),
        [activeLevels],
    );

    const summaryGroups = useMemo(() => {
        const activeGroup = groupConfigs.find((group) =>
            group.configs.includes(activeConfig.key),
        );

        if (!activeGroup) return [];

        return [activeGroup]
            .map((groupConfig) => {
                const subs = groupConfig.configs
                    .map((key) => listByKey[key])
                    .filter(Boolean)
                    .map((config) => {
                        const countedLevels =
                            config.levels.flatMap(getCountedLevels);
                        const grandLevels = config.levels.flatMap(getAllLevels);

                        const completed = countedLevels.filter(
                            (level) =>
                                progress[
                                    getLevelKey(level, duplicateLevelIds)
                                ] === 100,
                        ).length;

                        const grandCompleted = grandLevels.filter(
                            (level) =>
                                progress[
                                    getLevelKey(level, duplicateLevelIds)
                                ] === 100,
                        ).length;

                        return {
                            key: config.key,
                            label: config.summaryLabel ?? config.sub,
                            completed,
                            grandCompleted,
                        };
                    });

                return {
                    key: groupConfig.key,
                    label: groupConfig.label,
                    total: subs.reduce((sum, sub) => sum + sub.completed, 0),
                    grandTotal: subs.reduce(
                        (sum, sub) => sum + sub.grandCompleted,
                        0,
                    ),
                    subs,
                };
            })
            .filter((group) => group.subs.length > 0);
    }, [activeConfig, progress]);

    const totalCompleted = useMemo(
        () =>
            grandLevels.filter(
                (level) =>
                    progress[getLevelKey(level, duplicateLevelIds)] === 100,
            ).length,
        [grandLevels, progress],
    );
    const totalAttemptsAll = useMemo(
        () => sumAttempts(countedLevels, attempts, duplicateLevelIds),
        [countedLevels, attempts],
    );
    const totalCount = grandLevels.length;
    const overallPercent =
        totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;

    const completedRanks = useMemo(() => {
        return activeLevels
            .map((rank) => {
                const levels = getAllLevels(rank);
                const completed = levels.filter(
                    (level) =>
                        progress[getLevelKey(level, duplicateLevelIds)] === 100,
                ).length;
                const requirement = rank.requirement || 0;
                const nestedRanks = rank.ranks ?? rank.subranks;
                const isPlusPossible = !nestedRanks || nestedRanks.length === 0;
                const isPlus =
                    isPlusPossible &&
                    levels.length > 0 &&
                    completed === levels.length;
                const requirementMet = rank.excludeFromTotal
                    ? completed === levels.length
                    : requirement > 0
                      ? completed >= requirement
                      : isPlus;

                if (!requirementMet) return null;
                const rankLabel = rank.rank ?? rank.name;
                const rankColor = rank.headerColor
                    ? `#${rank.headerColor.replace("#", "")}`
                    : activeColors[rankLabel];
                return {
                    label:
                        isPlus && !rank.noPlusRanks
                            ? `${rankLabel}+`
                            : rankLabel,
                    color: rankColor,
                };
            })
            .filter(Boolean);
    }, [activeColors, activeLevels, progress]);

    const inProgressLevels = useMemo(() => {
        const items = [];

        activeLevels.forEach((rank) => {
            if (rank.levels) {
                rank.levels.forEach((level) => {
                    const pct =
                        Number(
                            progress[getLevelKey(level, duplicateLevelIds)],
                        ) || 0;
                    if (pct > 0 && pct < 100) {
                        items.push({
                            key: getLevelKey(level, duplicateLevelIds),
                            id: level.id,
                            name: level.name,
                            progress: pct,
                            rankColor:
                                rank.headerColor ||
                                activeColors[rank.rank ?? rank.name],
                        });
                    }
                });
            }

            const nestedRanks = rank.ranks ?? rank.subranks;
            if (nestedRanks) {
                nestedRanks.forEach((subrank) => {
                    const subColor =
                        activeColors[subrank.rank] ||
                        activeColors[rank.rank ?? rank.name];
                    subrank.levels.forEach((level) => {
                        const pct =
                            Number(
                                progress[getLevelKey(level, duplicateLevelIds)],
                            ) || 0;
                        if (pct > 0 && pct < 100) {
                            items.push({
                                key: getLevelKey(level, duplicateLevelIds),
                                id: level.id,
                                name: level.name,
                                progress: pct,
                                rankColor: subColor,
                            });
                        }
                    });
                });
            }
        });

        return items;
    }, [activeLevels, progress, activeColors]);

    return (
        <PageShell>
            <div className="bg-level p-6 mb-6">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">
                                Stats
                            </h2>
                            <p className="text-sm text-white/70">
                                Track completion progress across each list
                                and rank
                            </p>
                        </div>
                        <ListDropdown
                            listTree={listTree}
                            label={activePathLabels.join(" ")}
                            activeKey={activeConfig.key}
                            activePathLabels={activePathLabels}
                            onSelect={(config) =>
                                setSelectedListKey(config.key)
                            }
                        />
                    </div>
                </div>
                <OverallCompletion
                    totalCompleted={totalCompleted}
                    totalCount={totalCount}
                    overallPercent={overallPercent}
                />
            </div>

            <RanksGrid
                activeList={activeList}
                activeColors={activeColors}
                progress={progress}
                attempts={attempts}
                settings={settings}
                duplicateIds={duplicateLevelIds}
            />

            <div className="space-y-6">
                <CompletedRanks completedRanks={completedRanks} />
                <InProgressLevels inProgressLevels={inProgressLevels} />
                <SummaryCards
                    summaryGroups={summaryGroups}
                    totalAttemptsAll={totalAttemptsAll}
                    showAttempts={settings.showAttempts}
                />
            </div>
        </PageShell>
    );
};
