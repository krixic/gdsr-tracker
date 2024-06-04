import React, { useState, useEffect } from "react";
import "./levels.css";
import { levels as levelsData, rankRequirements } from "../../data/levels.js";

export const Levels = () => {
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
    if (hasUnsavedChanges === false) {
      return "none";
    } else {
      return "block";
    }
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
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [level]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("completedLevels", JSON.stringify(completedLevels));
    localStorage.setItem("inputValues", JSON.stringify(inputValues));
  }, [completedLevels, inputValues]);

  const rankColors = {
    Bronze: "#dd7e6b",
    Silver: "#b7b7b7",
    Gold: "#f1c232",
    Emerald: "#6aa84f",
    Ruby: "#cc0000",
    Diamond: "#3d85c6",
    Amethyst: "#ff00ff",
    Legend: "#000000",
    Bonus: "#b4a7d6",
  };

  const getRankBackgroundColor = (rank) => {
    // const defaultColor = "rgb(196, 34, 34)";
    const totalNumberOfLevels = levelsData[0][rank].length;
    const numberOfCompletedLevels = levelsData[0][rank].filter(
      (level) => completedLevels[level] === "completed"
    ).length;
    const requiredLevels = rankRequirements[rank];
    if (
      levelsData[0][rank].filter(
        (level) => completedLevels[level] === "completed"
      ).length < requiredLevels
    ) {
      return [rankColors[rank], `4px solid ${rankColors[rank]}`];
    } else if (
      levelsData[0][rank].filter(
        (level) => completedLevels[level] === "completed"
      ).length >= requiredLevels &&
      totalNumberOfLevels !== numberOfCompletedLevels
    ) {
      return [rankColors[rank], "4px solid gold"];
    }

    if (totalNumberOfLevels === numberOfCompletedLevels) {
      return [rankColors[rank], "4px solid black"];
    }

    return "";
  };

  return (
    <>
      {console.log("poop", hasUnsavedChanges)}
      <div className="levels">
        {Object.keys(levelsData[0]).map((rank) => {
          const completedLevelsInRank = levelsData[0][rank].filter(
            (level) => completedLevels[level] === "completed"
          );

          return (
            <div className="levelrank" key={rank}>
              <div
                className="nameprogress levels-heading"
                style={{
                  border: getRankBackgroundColor(rank)[1],
                  boxSizing: "border-box",
                  backgroundColor: getRankBackgroundColor(rank)[0],
                }}
              >
                <div className="rank">
                  {rank} {"("}
                  {completedLevelsInRank.length}
                  {")"}
                </div>
                <div
                  className="progressypoo"
                  style={{ backgroundColor: getRankBackgroundColor(rank) }}
                >
                  <div className="progressfart">Progress</div>{" "}
                </div>
              </div>

              <div className="nameprogresscontainer">
                {levelsData[0][rank].map((level, index) => (
                  <div className="nameprogress" key={index}>
                    <div
                      className={`level ${completedLevels[level]}`}
                      onClick={() => {
                        toggleStatus(level);
                        setHasUnsavedChanges(true);
                      }}
                    >
                      {console.log(hasUnsavedChanges)}
                      {level.substring(0, level.lastIndexOf(" "))}
                    </div>
                    <form
                      className="progressypoo"
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <label>
                        <input
                          type="text"
                          className="progressinput"
                          value={
                            completedLevels[level] === "completed"
                              ? "100"
                              : completedLevels[level] === "uncompleted"
                              ? ""
                              : inputValues[level] || ""
                          }
                          placeholder="0"
                          onChange={(e) =>
                            handleInputChange(level, e.target.value)
                          }
                        />
                      </label>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="toast"
        onClick={() => window.location.reload()}
        style={{ display: displayToastOnUnsavedChange() }}
      >
        {console.log(displayToastOnUnsavedChange())}
        Save changes
      </button>
    </>
  );
};
