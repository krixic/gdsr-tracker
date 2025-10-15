import React, { useState } from "react";
import "./progress.css";
import { levels as levelsData, rankRequirements } from "../../data/levels.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { difficultyOrder, rankColors } from "../../data/utils.js";

export const Progress = () => {
    const completed = JSON.parse(localStorage.getItem("completedLevels")) || {};
    const progress = JSON.parse(localStorage.getItem("inputValues")) || {};
    const [visible, setVisible] = useState({
        completed: true,
        progress: true,
        ranksDone: true,
        ranksLeft: true,
    });
    const [filter, setFilter] = useState("difficultyDescending");
    const [asc, setAsc] = useState(false);

    const getRankColor = (lvl) => {
        for (const pack of levelsData)
            for (const [key, val] of Object.entries(pack)) {
                if (Array.isArray(val) && val.includes(lvl))
                    return rankColors[key] || "#000";
                if (typeof val === "object")
                    for (const [diff, sub] of Object.entries(val))
                        if (sub.includes(lvl))
                            return rankColors[diff] || "#000";
            }
        return "#000";
    };

    const getDiffIndex = (lvl) => {
        for (const pack of levelsData)
            for (const [key, val] of Object.entries(pack)) {
                if (Array.isArray(val) && val.includes(lvl))
                    return difficultyOrder.indexOf(key);
                if (typeof val === "object")
                    for (const [diff, sub] of Object.entries(val))
                        if (sub.includes(lvl))
                            return difficultyOrder.indexOf(diff);
            }
        return -1;
    };

    const getCompletedCount = (rank) =>
        levelsData.reduce((count, pack) => {
            const val = pack[rank];
            if (!val) return count;
            if (Array.isArray(val))
                return (
                    count +
                    val.filter((l) => completed[l] === "completed").length
                );
            if (typeof val === "object")
                return (
                    count +
                    Object.values(val)
                        .flat()
                        .filter((l) => completed[l] === "completed").length
                );
            return count;
        }, 0);

    const getTotalInRank = (rank) => {
        let total = 0;
        for (const pack of levelsData) {
            const val = pack[rank];
            if (!val) continue;
            total += Array.isArray(val)
                ? val.length
                : Object.values(val).flat().length;
        }
        return total;
    };

    const sortLevels = (arr) => {
        const sorted = [...arr];
        if (filter.includes("alphabetical")) sorted.sort();
        else sorted.sort((a, b) => getDiffIndex(a) - getDiffIndex(b));
        if (!asc) sorted.reverse();
        return sorted;
    };

    const levelsCompleted = sortLevels(
        Object.keys(completed).filter((l) => completed[l] === "completed")
    );
    const levelsInProgress = sortLevels(
        Object.keys(progress).filter(
            (l) => progress[l] !== "100" && completed[l] !== "completed"
        )
    );

    const achieved = Object.keys(rankRequirements).filter(
        (r) => getCompletedCount(r) >= rankRequirements[r]
    );
    const remaining = Object.keys(rankRequirements).filter(
        (r) => getCompletedCount(r) < rankRequirements[r]
    );

    const renderPlus = (rank) =>
        getCompletedCount(rank) === getTotalInRank(rank) ? (
            <strong>{rank}+</strong>
        ) : null;

    const toggle = (key) => setVisible({ ...visible, [key]: !visible[key] });

    return (
        <div className="progress">
            <div className="filters">
                <button
                    onClick={() =>
                        setFilter(
                            filter === "difficultyDescending"
                                ? "alphabeticalDescending"
                                : "difficultyDescending"
                        )
                    }
                    className="difficultyalphabetical"
                >
                    {filter.includes("difficulty")
                        ? "Difficulty"
                        : "Alphabetical"}
                </button>
                <button
                    onClick={() => setAsc(!asc)}
                    className="ascendingdescending"
                >
                    <FontAwesomeIcon icon={asc ? faCaretUp : faCaretDown} />
                </button>
            </div>

            <div className="progresscontainercontainercontainer">
                <div className="progresscontainercontainer">
                    <div className="progresscontainer">
                        <div
                            className="progresscontainertitle"
                            onClick={() => toggle("completed")}
                        >
                            Levels Completed
                        </div>
                        {visible.completed && (
                            <div className="progresscontainercontent">
                                {levelsCompleted.map((lvl, i) => (
                                    <div
                                        key={i}
                                        className="progresslevel"
                                        style={{ color: getRankColor(lvl) }}
                                    >
                                        {lvl.substring(0, lvl.lastIndexOf(" "))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="progresscontainer">
                        <div
                            className="progresscontainertitle"
                            onClick={() => toggle("progress")}
                        >
                            Levels with Progress
                        </div>
                        {visible.progress && (
                            <div className="progresscontainercontent">
                                {levelsInProgress.map((lvl, i) => (
                                    <div
                                        key={i}
                                        className="progresslevel"
                                        style={{ color: getRankColor(lvl) }}
                                    >
                                        {lvl.substring(0, lvl.lastIndexOf(" "))}{" "}
                                        {progress[lvl]}%
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="progresscontainercontainer">
                    <div className="progresscontainer">
                        <div
                            className="progresscontainertitle"
                            onClick={() => toggle("ranksDone")}
                        >
                            Ranks Completed
                        </div>
                        {visible.ranksDone && (
                            <div className="progresscontainercontent">
                                {achieved.map((r) => (
                                    <div
                                        key={r}
                                        className="progresslevel"
                                        style={{ color: rankColors[r] }}
                                    >
                                        {renderPlus(r) ||
                                            `${r} (${getCompletedCount(
                                                r
                                            )}/${getTotalInRank(r)})`}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="progresscontainer">
                        <div
                            className="progresscontainertitle"
                            onClick={() => toggle("ranksLeft")}
                        >
                            Ranks to Achieve
                        </div>
                        {visible.ranksLeft && (
                            <div className="progresscontainercontent">
                                {remaining.map((r) => (
                                    <div
                                        key={r}
                                        className="progresslevel"
                                        style={{ color: rankColors[r] }}
                                    >
                                        {r} ({getCompletedCount(r)}/
                                        {rankRequirements[r]})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
