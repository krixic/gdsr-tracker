import React from "react";
import "./progress.css";
import { levels as levelsData, rankRequirements } from "../../data/levels.js";

export const Progress = () => {
  const completedLevels =
    JSON.parse(localStorage.getItem("completedLevels")) || {};

  const levelswithprogress =
    JSON.parse(localStorage.getItem("inputValues")) || {};

  // Create an array of level names from the levels object
  const levelNames = Object.keys(completedLevels);

  const levelProgresses = Object.keys(levelswithprogress);

  // Sort the level names alphabetically
  levelNames.sort();

  const achievedRanks = Object.keys(rankRequirements).filter((rank) => {
    const requiredLevels = rankRequirements[rank];
    const completedLevelsInRank = levelsData[0][rank].filter(
      (level) => completedLevels[level] === "completed"
    );

    return completedLevelsInRank.length >= requiredLevels;
  });

  const remainingRanks = Object.keys(rankRequirements).filter((rank) => {
    const requiredLevels = rankRequirements[rank];
    const completedLevelsInRank = levelsData[0][rank].filter(
      (level) => completedLevels[level] === "completed"
    );

    return completedLevelsInRank.length < requiredLevels;
  });

  return (
    <div className="progress">
      <h1 className="progresstitle">Progress</h1>
      <div className="progresscontainercontainer">
        <div className="progresscontainer">
          <div className="levelscompleted">
            <h2>Levels Completed</h2>
            <div>
              {levelNames.map(
                (levelName, index) =>
                  completedLevels[levelName] === "completed" && (
                    <div key={index}>
                      {levelName.substring(0, levelName.lastIndexOf(" "))}
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
                          {levelswithprogress[levelProgress]}
                          {"%"}
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="progresscontainer">
          <div className="levelscompleted">
            <h2>Ranks Achieved</h2>
            <div>
              {achievedRanks.map((rank) => (
                <div key={rank}>
                  {rank} {"("}
                  {
                    levelsData[0][rank].filter(
                      (level) => completedLevels[level] === "completed"
                    ).length
                  }
                  {")"}
                </div>
              ))}
            </div>
          </div>
          <div className="levelsprogresssss">
            <h2>Ranks to Achieve</h2>
            <div>
              {remainingRanks.map((rank) => (
                <div key={rank}>
                  {rank} {"("}
                  {
                    levelsData[0][rank].filter(
                      (level) => completedLevels[level] === "completed"
                    ).length
                  }
                  {")"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
