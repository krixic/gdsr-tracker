import React, { useState, useEffect } from "react";
import "./levels.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";

export const DlcLevels = ({ levelsData }) => {
    const initialCompletedLevels =
        JSON.parse(localStorage.getItem("completedLevels")) || {};
    const initialInputValues =
        JSON.parse(localStorage.getItem("inputValues")) || {};

    const [completedLevels, setCompletedLevels] = useState(
        initialCompletedLevels
    );
    const [inputValues, setInputValues] = useState(initialInputValues);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const displayToastOnUnsavedChange = () => {
        return hasUnsavedChanges ? "block" : "none";
    };

    const handleCopy = (level) => {
        const id = level.match(/\((.*?)\)/)[1];
        const copiedLevelName = level.replace(/\s*\(.*?\)\s*/g, "");

        copy(id);

        toast(`Copied ${id} (${copiedLevelName})`);
    };

    const toggleStatus = (level) => {
        setCompletedLevels((prevCompletedLevels) => {
            const prevStatus = prevCompletedLevels[level] || "uncompleted";
            let newStatus;
            if (prevStatus === "uncompleted") {
                newStatus = "doing";
                // Remove the level from local storage when marking it as doing
                delete inputValues[level];
            } else if (prevStatus === "doing") {
                newStatus = "completed";
                // Update local storage for inputValues to 100
                setInputValues((prevInputValues) => ({
                    ...prevInputValues,
                    [level]: "100",
                }));
            } else {
                newStatus = "uncompleted";
                // Remove the level from local storage when marking it as uncompleted
                delete inputValues[level];
            }

            // Update local storage for completedLevels
            const updatedCompletedLevels = {
                ...prevCompletedLevels,
                [level]: newStatus,
            };

            localStorage.setItem(
                "completedLevels",
                JSON.stringify(updatedCompletedLevels)
            );

            return updatedCompletedLevels;
        });
    };

    const handleInputChange = (level, value) => {
        // Update inputValues
        setInputValues((prevInputValues) => ({
            ...prevInputValues,
            [level]: value,
        }));

        // Automatically update level status if progress > 0 and < 100
        setCompletedLevels((prevCompletedLevels) => {
            let newStatus = prevCompletedLevels[level] || "uncompleted";

            if (value === "100") {
                newStatus = "completed";
            } else if (value && value !== "100") {
                newStatus = "doing";
            } else if (!value || value === "0") {
                newStatus = "uncompleted";
            }

            const updated = {
                ...prevCompletedLevels,
                [level]: newStatus,
            };

            localStorage.setItem("completedLevels", JSON.stringify(updated));
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

    const rankColors = {
        "DLC Challenges: Pack I 🌞": "#bf9000",
        "DLC Challenges: Pack II 🍂": "#e69138",
        "DLC Challenges: Pack III ❄": "#7aecec",
    };

    // const getRankBackgroundColor = (rank) => {
    //     // const defaultColor = "rgb(196, 34, 34)";

    //     const totalNumberOfLevels = levelsData[0][rank].length;
    //     const numberOfCompletedLevels = levelsData[0][rank].filter(
    //         (level) => completedLevels[level] === "completed"
    //     ).length;

    //     if (totalNumberOfLevels === numberOfCompletedLevels) {
    //         return [rankColors[rank], "plusrank"];
    //     }
    //     return [rankColors[rank], `norank`];
    // };

    const rightClickComplete = (level) => {
        setCompletedLevels((prevCompletedLevels) => {
            const updated = { ...prevCompletedLevels, [level]: "completed" };

            // Also mark inputValues as 100%
            setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [level]: "100",
            }));

            // Save to localStorage
            localStorage.setItem("completedLevels", JSON.stringify(updated));
            localStorage.setItem(
                "inputValues",
                JSON.stringify({
                    ...inputValues,
                    [level]: "100",
                })
            );

            return updated;
        });

        setHasUnsavedChanges(true);
    };

    // const getCompletedCountForRank = (rank) => {
    //     if (rank === "Bonus") {
    //         return levelsData[0].Bonus.filter(
    //             (b) => completedLevels[b.name] === "completed"
    //         ).length;
    //     } else {
    //         return levelsData[0][rank].filter(
    //             (level) => completedLevels[level] === "completed"
    //         ).length;
    //     }
    // };

    console.log(levelsData[0][0]);
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
                {Object.keys(levelsData[0]).map((rank) => {
                    return (
                        <div className="levelrank" key={rank}>
                            <div
                                // className={`nameprogress levels-heading ${
                                //     getRankBackgroundColor(rank)[1]
                                // } ${rank}`}
                                className={`nameprogress levels-heading`}
                                style={{
                                    // border: getRankBackgroundColor(rank)[1],
                                    boxSizing: "border-box",
                                    // backgroundColor:
                                    //     getRankBackgroundColor(rank)[0],
                                }}
                            >
                                <div className="rank">
                                    {/* {rank} ({getCompletedCountForRank(rank)}) */}
                                </div>

                                <div
                                    className="progressypoo"
                                    // style={{
                                    //     backgroundColor:
                                    //         getRankBackgroundColor(rank),
                                    // }}
                                >
                                    <div className="progressfart">Progress</div>{" "}
                                </div>
                            </div>

                            {/* <div className="nameprogresscontainer">
                                {levelsData[0][rank].map((levelData, index) => {
                                    const level =
                                        typeof levelData === "string"
                                            ? levelData
                                            : levelData.name;

                                    return (
                                        <div
                                            className="nameprogress"
                                            key={index}
                                        >
                                            <button
                                                className={
                                                    completedLevels[level]
                                                }
                                                onClick={() =>
                                                    handleCopy(level)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faCopy}
                                                />
                                            </button>

                                            <div
                                                className={`level ${completedLevels[level]}`}
                                                onClick={() => {
                                                    toggleStatus(level);
                                                    setHasUnsavedChanges(true);
                                                }}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    rightClickComplete(level);
                                                }}
                                            >
                                                {level.substring(
                                                    0,
                                                    level.lastIndexOf(" ")
                                                )}
                                            </div>

                                            {rank === "Bonus" && (
                                                <div
                                                    className="difficultysquare"
                                                    style={{
                                                        backgroundColor:
                                                            rankColors[
                                                                typeof levelData ===
                                                                "string"
                                                                    ? levelsData[0].Bonus.find(
                                                                          (b) =>
                                                                              b.name ===
                                                                              levelData
                                                                      )
                                                                          ?.difficulty
                                                                    : levelData.difficulty
                                                            ] || "gray", // fallback colour
                                                    }}
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
                                                            completedLevels[
                                                                level
                                                            ] === "completed"
                                                                ? "100"
                                                                : completedLevels[
                                                                      level
                                                                  ] ===
                                                                  "uncompleted"
                                                                ? ""
                                                                : inputValues[
                                                                      level
                                                                  ] || ""
                                                        }
                                                        placeholder="0"
                                                        onChange={(e) => {
                                                            handleInputChange(
                                                                level,
                                                                e.target.value
                                                            );
                                                            setHasUnsavedChanges(
                                                                true
                                                            );
                                                        }}
                                                    />
                                                </label>
                                            </form>
                                        </div>
                                    );
                                })}
                            </div> */}
                        </div>
                    );
                })}
            </div>
            <button
                className="toast"
                onClick={() => window.location.reload()}
                style={{ display: displayToastOnUnsavedChange() }}
            >
                Save changes
            </button>
        </>
    );
};
