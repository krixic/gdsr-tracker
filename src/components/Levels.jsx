import React, { useState, useEffect } from "react";
import { rankColors, rankRequirements } from "../util.js";
import toast, { useToasterStore } from "react-hot-toast";
import { LevelsToaster } from "./levels/LevelsToaster.jsx";
import { RankColumn } from "./levels/RankColumn.jsx";
import { getAllLevels } from "./levels/levelUtils.js";

const TOAST_LIMIT = 3;

const loadProgress = () => JSON.parse(localStorage.getItem("progress") || "{}");
const loadAttempts = () => JSON.parse(localStorage.getItem("attempts") || "{}");
const loadSettings = () => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : { showAttempts: false };
};

const saveProgress = (data) =>
    localStorage.setItem("progress", JSON.stringify(data));
const saveAttempts = (data) =>
    localStorage.setItem("attempts", JSON.stringify(data));

export const Levels = ({ levels, type = "gdsr" }) => {
    const activeTheme = rankColors[type] || {};
    const activeRequirements = rankRequirements[type] || {};
    const [progress, setProgress] = useState(loadProgress);
    const [attempts, setAttempts] = useState(loadAttempts);
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        saveProgress(progress);
    }, [progress]);
    useEffect(() => {
        saveAttempts(attempts);
    }, [attempts]);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "settings") setSettings(loadSettings());
        };
        window.addEventListener("storage", handleStorageChange);
        const interval = setInterval(() => setSettings(loadSettings()), 1000);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    const cycleLevel = (id) => {
        setProgress((prev) => {
            const next = { ...prev };
            if (!(id in next)) next[id] = 0;
            else if (next[id] < 100) next[id] = 100;
            else delete next[id];
            return next;
        });
    };

    const setDoingValue = (id, value, forceComplete = false) => {
        const v = forceComplete ? 100 : Math.min(100, Math.max(1, value));
        setProgress((prev) => ({ ...prev, [id]: v }));
    };

    const setAttemptsValue = (id, value) => {
        if (value === 0 || value === "") {
            setAttempts((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } else {
            setAttempts((prev) => ({ ...prev, [id]: value }));
        }
    };

    const toggleRankBulk = (e, rank) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const allLevels = getAllLevels(rank);
        setProgress((prev) => {
            const next = { ...prev };
            const allCompleted = allLevels.every((lvl) => prev[lvl.id] === 100);

            if (allCompleted) {
                allLevels.forEach((lvl) => delete next[lvl.id]);
            } else {
                allLevels.forEach((lvl) => (next[lvl.id] = 100));
            }

            return next;
        });
    };

    const { toasts } = useToasterStore();
    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= TOAST_LIMIT)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);

    return (
        <>
            <LevelsToaster />
            <div
                className={`max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 ${settings.showAttempts ? "gap-8" : "gap-10"} p-4 select-none`}
            >
                {levels.map((rank) => (
                    <RankColumn
                        key={rank.rank}
                        rank={rank}
                        activeTheme={activeTheme}
                        activeRequirements={activeRequirements}
                        progress={progress}
                        attempts={attempts}
                        showAttempts={settings.showAttempts}
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
