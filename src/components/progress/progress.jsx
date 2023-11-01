import React from "react";
import "./progress.css";

export const Progress = () => {
  const completedLevels =
    JSON.parse(localStorage.getItem("completedLevels")) || {};

  const levelswithprogress =
    JSON.parse(localStorage.getItem("inputValues")) || {};

  // Create an array of level names from the levels object
  const levelNames = Object.keys(completedLevels);

  const levelProgresses = Object.keys(levelswithprogress);

  const initialAttempts = JSON.parse(localStorage.getItem("attempts")) || {};

  // Sort the level names alphabetically
  levelNames.sort();

  return (
    <div className="progress">
      <h1>Progress</h1>
      <div className="progresscontainer">
        <div className="levelscompleted">
          <h2>Levels Completed</h2>
          <div>
            {levelNames.map(
              (levelName, index) =>
                completedLevels[levelName] === "completed" && (
                  <div key={index}>
                    {levelName.substring(0, levelName.lastIndexOf(" "))}
                    {" ("}
                    {initialAttempts[levelName] || "0"} atts
                    {")"}
                  </div>
                )
            )}
          </div>
        </div>
        <div className="levelsprogresssss">
          <h2>Levels with Progress</h2>
          <div>
            {levelProgresses.map((levelProgress, index) => (
              <div key={index}>
                <div>
                  {levelswithprogress[levelProgress] &&
                    levelswithprogress[levelProgress] !== "100" && (
                      <div>
                        {levelProgress.substring(
                          0,
                          levelProgress.lastIndexOf(" ")
                        )}{" "}
                        {"("}
                        {levelswithprogress[levelProgress]}
                        {"%) ("}
                        {initialAttempts[levelProgress] || "0"} atts
                        {")"}
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
