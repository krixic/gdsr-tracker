import React, { useState, useEffect } from "react";
import "./levels.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import { rankColors } from "../../data/utils.js";
import { rankRequirements } from "../../data/levels.js";

export const Levels = ({ levelsData }) => {
    const initialCompletedLevels =
        JSON.parse(localStorage.getItem("completedLevels")) || {};
    const initialInputValues =
        JSON.parse(localStorage.getItem("inputValues")) || {};

    const [completedLevels, setCompletedLevels] = useState(
        initialCompletedLevels
    );
    const [inputValues, setInputValues] = useState(initialInputValues);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const handleCopy = (level) => {
        const id = level.match(/\((.*?)\)/)?.[1];
        const copiedLevelName = level.replace(/\s*\(.*?\)\s*/g, "");

        if (id) {
            copy(id);
            toast(`Copied ${id} (${copiedLevelName})`);
        }
    };

    const toggleStatus = (level) => {
        setCompletedLevels((prev) => {
            const prevStatus = prev[level] || "uncompleted";
            let newStatus;

            if (prevStatus === "uncompleted") {
                newStatus = "doing";
                delete inputValues[level];
            } else if (prevStatus === "doing") {
                newStatus = "completed";
                setInputValues((prevInput) => ({
                    ...prevInput,
                    [level]: "100",
                }));
            } else {
                newStatus = "uncompleted";
                delete inputValues[level];
            }

            const updated = { ...prev, [level]: newStatus };
            localStorage.setItem("completedLevels", JSON.stringify(updated));
            return updated;
        });
    };

    const handleInputChange = (level, value) => {
        setInputValues((prev) => ({ ...prev, [level]: value }));

        setCompletedLevels((prev) => {
            let newStatus = prev[level] || "uncompleted";
            if (value === "100") newStatus = "completed";
            else if (value && value !== "100") newStatus = "doing";
            else newStatus = "uncompleted";

            const updated = { ...prev, [level]: newStatus };
            localStorage.setItem("completedLevels", JSON.stringify(updated));
            return updated;
        });

        setHasUnsavedChanges(true);
    };

    const rightClickComplete = (level) => {
        setCompletedLevels((prev) => {
            const updated = { ...prev, [level]: "completed" };
            setInputValues((prevInput) => ({ ...prevInput, [level]: "100" }));
            localStorage.setItem("completedLevels", JSON.stringify(updated));
            localStorage.setItem(
                "inputValues",
                JSON.stringify({ ...inputValues, [level]: "100" })
            );
            return updated;
        });
        setHasUnsavedChanges(true);
    };

    useEffect(() => {
        localStorage.setItem(
            "completedLevels",
            JSON.stringify(completedLevels)
        );
        localStorage.setItem("inputValues", JSON.stringify(inputValues));
    }, [completedLevels, inputValues]);

    if (!levelsData || !Array.isArray(levelsData) || !levelsData[0]) {
        return <div className="levels">Loading Levels...</div>;
    }

    const currentPath = window.location.pathname;
    const allPacks = levelsData[0];
    const dlcPacks = ["Pack I", "Pack II", "Pack III"];

    const filteredPackNames = Object.keys(allPacks).filter((packName) =>
        currentPath === "/dlc"
            ? dlcPacks.includes(packName)
            : !dlcPacks.includes(packName)
    );

    const getCounts = (packName, flattenedLevels) => {
        const total = flattenedLevels.length;
        const completed = flattenedLevels.filter(
            (lvl) => completedLevels[lvl.name] === "completed"
        ).length;
        return { total, completed };
    };

    return (
        <>
            <Toaster
                containerClassName="copytoastcontainer"
                toastOptions={{
                    duration: 2000,
                    style: {
                        backgroundColor: "rgb(0,180,0)",
                        borderRadius: 0,
                        padding: "0 16px",
                        color: "white",
                        height: "50px",
                        fontFamily: "Readex Pro",
                        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
                        userSelect: "none",
                    },
                }}
            />

            <div className="levels">
                {filteredPackNames.map((packName) => {
                    const pack = allPacks[packName];
                    let flattenedLevels = [];

                    if (typeof pack === "object" && !Array.isArray(pack)) {
                        flattenedLevels = Object.entries(pack).flatMap(
                            ([difficulty, lvls]) =>
                                lvls.map((lvlName) => ({
                                    name: lvlName,
                                    difficulty,
                                }))
                        );
                    } else if (Array.isArray(pack)) {
                        flattenedLevels = pack.map((lvl) =>
                            typeof lvl === "string"
                                ? { name: lvl, difficulty: null }
                                : lvl
                        );
                    }

                    const { total, completed } = getCounts(
                        packName,
                        flattenedLevels
                    );

                    const meetsRequirement =
                        rankRequirements[packName] &&
                        completed >= rankRequirements[packName];
                    const allCompleted = completed === total;

                    let rankClass = "norank";
                    if (allCompleted) {
                        rankClass =
                            packName === "Legend"
                                ? "plusrank Legend"
                                : "plusrank";
                    } else if (meetsRequirement && packName === "Gold") {
                        rankClass = "rankachieved Gold";
                    } else if (meetsRequirement) {
                        rankClass = "rankachieved";
                    }

                    return (
                        <div className="levelrank" key={packName}>
                            <div
                                className={`nameprogress levels-heading ${rankClass}`}
                                style={{
                                    backgroundColor:
                                        rankColors[packName] || "#888",
                                    boxSizing: "border-box",
                                }}
                            >
                                <div className="rank">
                                    {packName} ({completed}/{total})
                                </div>
                            </div>

                            <div className="nameprogresscontainer">
                                {flattenedLevels.map((lvlObj, index) => {
                                    const level = lvlObj.name;
                                    const status =
                                        completedLevels[level] || "uncompleted";
                                    const display =
                                        level.substring(
                                            0,
                                            level.lastIndexOf(" ")
                                        ) || level;

                                    return (
                                        <div
                                            className="nameprogress"
                                            key={index}
                                        >
                                            <button
                                                className={status}
                                                onClick={() =>
                                                    handleCopy(level)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCopy}
                                                />
                                            </button>

                                            <div
                                                className={`level ${status}`}
                                                onClick={() =>
                                                    toggleStatus(level)
                                                }
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    rightClickComplete(level);
                                                }}
                                            >
                                                {display}
                                            </div>

                                            {lvlObj.difficulty && (
                                                <div
                                                    className="difficultysquare"
                                                    style={{
                                                        backgroundColor:
                                                            rankColors[
                                                                lvlObj
                                                                    .difficulty
                                                            ] || "#777",
                                                    }}
                                                    title={lvlObj.difficulty}
                                                />
                                            )}

                                            <form
                                                className="progressypoo"
                                                onSubmit={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                <label>
                                                    <input
                                                        type="text"
                                                        className="progressinput"
                                                        value={
                                                            status ===
                                                            "completed"
                                                                ? "100"
                                                                : status ===
                                                                  "uncompleted"
                                                                ? ""
                                                                : inputValues[
                                                                      level
                                                                  ] || ""
                                                        }
                                                        placeholder="0"
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                level,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </form>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                className="toast"
                onClick={() => window.location.reload()}
                style={{ display: hasUnsavedChanges ? "block" : "none" }}
            >
                Save changes
            </button>
        </>
    );
};
