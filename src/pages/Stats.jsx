import React, { useEffect, useMemo, useState } from "react";
import { gdsrLevels } from "../data/gdsr.js";
import { dlcLevels } from "../data/dlc.js";
import { ccplLevels } from "../data/ccpl.js";
import { rankColors, rankRequirements } from "../util.js";
import { StatsHeader } from "../components/stats/StatsHeader.jsx";
import { OverallCompletion } from "../components/stats/OverallCompletion.jsx";
import { RanksGrid } from "../components/stats/RanksGrid.jsx";
import { CompletedRanks } from "../components/stats/CompletedRanks.jsx";
import { SummaryCards } from "../components/stats/SummaryCards.jsx";
import { InProgressLevels } from "../components/stats/InProgressLevels.jsx";
import { getAllLevels, sumAttempts } from "../components/stats/statsUtils.js";

const loadProgress = () => JSON.parse(localStorage.getItem("progress") || "{}");
const loadAttempts = () => JSON.parse(localStorage.getItem("attempts") || "{}");
const loadSettings = () => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : { showAttempts: false };
};

const EMPTY_OBJECT = Object.freeze({});

export const Stats = () => {
    const [progress, setProgress] = useState(loadProgress);
    const [attempts, setAttempts] = useState(loadAttempts);
    const [settings, setSettings] = useState(loadSettings);
    const [openMainMenu, setOpenMainMenu] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const [selectedMain, setSelectedMain] = useState("gdsr");
    const [selectedSub, setSelectedSub] = useState("wave");

    useEffect(() => {
        document.title = "GDSR";
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "progress") setProgress(loadProgress());
            if (e.key === "attempts") setAttempts(loadAttempts());
            if (e.key === "settings") setSettings(loadSettings());
        };
        window.addEventListener("storage", handleStorageChange);
        const interval = setInterval(() => {
            setProgress(loadProgress());
            setAttempts(loadAttempts());
            setSettings(loadSettings());
        }, 1000);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const listOptions = {
        gdsr: {
            label: "GDSR",
            subs: {
                wave: { label: "Wave", levels: gdsrLevels, type: "gdsr" },
                dlc: { label: "DLC", levels: dlcLevels, type: "dlc" },
            },
        },
        ccpl: {
            label: "CCPL",
            subs: {
                wave: { label: "Wave", levels: ccplLevels, type: "ccpl" },
            },
        },
    };

    const activeMain = listOptions[selectedMain] || listOptions.gdsr;
    const activeSub =
        activeMain.subs[selectedSub] ||
        activeMain.subs[Object.keys(activeMain.subs)[0]];
    const activeList = {
        label: `${activeMain.label} ${activeSub.label}`,
        levels: activeSub.levels,
        type: activeSub.type,
    };
    const activeRequirements =
        rankRequirements[activeList.type] ?? EMPTY_OBJECT;
    const activeColors = rankColors[activeList.type] ?? EMPTY_OBJECT;

    const allLevels = useMemo(
        () => activeList.levels.flatMap(getAllLevels),
        [activeList.levels],
    );
    const allMainLevels = useMemo(() => {
        const mainLevels = Object.values(activeMain.subs)
            .map((sub) => sub.levels)
            .flat()
            .flatMap(getAllLevels);
        return mainLevels;
    }, [activeMain.subs]);

    const totalCompleted = useMemo(
        () => allLevels.filter((level) => progress[level.id] === 100).length,
        [allLevels, progress],
    );
    const totalAttemptsAll = useMemo(
        () => sumAttempts(allLevels, attempts),
        [allLevels, attempts],
    );
    const totalCompletedMain = useMemo(
        () =>
            allMainLevels.filter((level) => progress[level.id] === 100).length,
        [allMainLevels, progress],
    );
    const totalCount = allLevels.length;
    const overallPercent =
        totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;

    const completedRanks = useMemo(() => {
        return activeList.levels
            .map((rank) => {
                const levels = getAllLevels(rank);
                const completed = levels.filter(
                    (level) => progress[level.id] === 100,
                ).length;
                const requirement = activeRequirements[rank.rank] || 0;
                const isPlusPossible =
                    !rank.subranks || rank.subranks.length === 0;
                const isPlus =
                    isPlusPossible &&
                    levels.length > 0 &&
                    completed === levels.length;
                const requirementMet =
                    requirement > 0 ? completed >= requirement : isPlus;

                if (!requirementMet) return null;
                return isPlus ? `${rank.rank}+` : rank.rank;
            })
            .filter(Boolean);
    }, [activeList.levels, activeRequirements, progress]);

    const inProgressLevels = useMemo(() => {
        const items = [];

        activeList.levels.forEach((rank) => {
            if (rank.levels) {
                rank.levels.forEach((level) => {
                    const pct = Number(progress[level.id]) || 0;
                    if (pct > 0 && pct < 100) {
                        items.push({
                            id: level.id,
                            name: level.name,
                            progress: pct,
                            rankColor: activeColors[rank.rank],
                        });
                    }
                });
            }

            if (rank.subranks) {
                rank.subranks.forEach((subrank) => {
                    const subColor =
                        activeColors[subrank.rank] || activeColors[rank.rank];
                    subrank.levels.forEach((level) => {
                        const pct = Number(progress[level.id]) || 0;
                        if (pct > 0 && pct < 100) {
                            items.push({
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
    }, [activeList.levels, progress, activeColors]);

    return (
        <div className="flex w-full max-w-[1200px] mx-auto gap-8 px-4 py-8">
            <div className="flex-1 min-w-0">
                <div className="bg-level p-6 mb-6">
                    <StatsHeader
                        activeMain={activeMain}
                        activeSub={activeSub}
                        listOptions={listOptions}
                        selectedMain={selectedMain}
                        selectedSub={selectedSub}
                        setSelectedMain={setSelectedMain}
                        setSelectedSub={setSelectedSub}
                        openMainMenu={openMainMenu}
                        setOpenMainMenu={setOpenMainMenu}
                        openSubMenu={openSubMenu}
                        setOpenSubMenu={setOpenSubMenu}
                    />
                    <OverallCompletion
                        totalCompleted={totalCompleted}
                        totalCount={totalCount}
                        overallPercent={overallPercent}
                    />
                </div>

                <RanksGrid
                    activeList={activeList}
                    activeRequirements={activeRequirements}
                    activeColors={activeColors}
                    progress={progress}
                    attempts={attempts}
                    settings={settings}
                />

                <div className="space-y-6">
                    <CompletedRanks
                        completedRanks={completedRanks}
                        activeColors={activeColors}
                    />
                    <InProgressLevels inProgressLevels={inProgressLevels} />
                    <SummaryCards
                        totalCompleted={totalCompleted}
                        totalListCompleted={totalCompletedMain}
                        totalAttemptsAll={totalAttemptsAll}
                        showAttempts={settings.showAttempts}
                        listLabel={activeList.label}
                        mainLabel={activeMain.label}
                    />
                </div>
            </div>
        </div>
    );
};
