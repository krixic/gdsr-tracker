import React, { useState } from "react";
import "./progress.css";
import { levels as levelsData, rankRequirements } from "../../data/levels.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

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

  const renderPlus = (rank) => {
    const totalNumberOfLevels = levelsData[0][rank].length;
    const numberOfCompletedLevels = levelsData[0][rank].filter(
      (level) => completedLevels[level] === "completed"
    ).length;

    if (rank === "Bonus") {
      if (totalNumberOfLevels === numberOfCompletedLevels) {
        return ""; // Special rendering for Bonus rank
      }
    }

    if (totalNumberOfLevels === numberOfCompletedLevels) {
      return (
        <strong>
          {rank}+<br />
        </strong>
      );
    }

    return "";
  };

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

  const getRankColorByName = (levelName) => {
    for (const level of levelsData) {
      for (const [rank, names] of Object.entries(level)) {
        if (names.includes(levelName)) {
          return rankColors[rank];
        }
      }
    }
    return null;
  };

  const getRankColorByRank = (rankName) => {
    return rankColors[rankName];
  };

  const [isLevelNamesVisible, setIsLevelNamesVisible] = useState(true);

  const [isLevelProgressesVisible, setIsLevelProgressesVisible] =
    useState(true);

  const [isRanksAchievedVisible, setIsRanksAchievedVisible] = useState(true);

  const [isRanksToAchieveVisible, setIsRanksToAchieveVisible] = useState(true);

  return (
    <div className="progress">
      {/* <div className="filters">
        <form>
          <div className="filtertitle">Filter</div>
          <label for="alphabeticalascending">A-Z</label>
          <input type="radio" name="filter"></input>
          <label for="alphabeticaldescending">Z-D</label>
          <input type="radio" name="filter"></input>
          <label for="difficultyascending">Difficulty Ascending</label>
          <input type="radio" name="filter"></input>
          <label for="difficultydescending">Difficulty Descending</label>
          <input type="radio" name="filter"></input>
        </form>
      </div> */}
      <div className="progresscontainercontainercontainer">
        <div className="progresscontainercontainer">
          <div className="progresscontainer">
            <div
              className="progresscontainertitle"
              onClick={() => {
                isLevelNamesVisible === true
                  ? setIsLevelNamesVisible(false)
                  : setIsLevelNamesVisible(true);
              }}
            >
              Levels Completed
            </div>
            <div className="progresscontainercontent">
              {isLevelNamesVisible && (
                <div>
                  {levelNames.map(
                    (levelName, index) =>
                      completedLevels[levelName] === "completed" && (
                        <div
                          key={index}
                          style={{ color: getRankColorByName(levelName) }}
                          className="progresslevel"
                        >
                          {levelName.substring(0, levelName.lastIndexOf(" "))}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="progresscontainer">
            <div
              className="progresscontainertitle"
              onClick={() => {
                isLevelProgressesVisible === true
                  ? setIsLevelProgressesVisible(false)
                  : setIsLevelProgressesVisible(true);
              }}
            >
              Levels with Progress
            </div>
            <div className="progresscontainercontent">
              {isLevelProgressesVisible && (
                <div>
                  {levelProgresses.map((levelProgress, index) => (
                    <div
                      key={index}
                      style={{ color: getRankColorByName(levelProgress) }}
                    >
                      <div className="progresslevel">
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
              )}
            </div>
          </div>
        </div>
        <div className="progresscontainercontainer">
          <div className="progresscontainer">
            <div
              className="progresscontainertitle"
              onClick={() => {
                isRanksAchievedVisible === true
                  ? setIsRanksAchievedVisible(false)
                  : setIsRanksAchievedVisible(true);
              }}
            >
              Ranks Completed
            </div>
            <div className="progresscontainercontent">
              {isRanksAchievedVisible && (
                <div>
                  {achievedRanks.reverse().map((rank) => (
                    <div
                      key={rank}
                      style={{ color: getRankColorByRank(rank) }}
                      className="progresslevel"
                    >
                      {renderPlus(rank)}
                      {!renderPlus(rank) && (
                        <>
                          {rank} {" ("}
                          {
                            levelsData[0][rank].filter(
                              (level) => completedLevels[level] === "completed"
                            ).length
                          }
                          {")"}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="progresscontainer">
            <div
              className="progresscontainertitle"
              onClick={() => {
                isRanksToAchieveVisible === true
                  ? setIsRanksToAchieveVisible(false)
                  : setIsRanksToAchieveVisible(true);
              }}
            >
              Ranks to Achieve
            </div>
            <div className="progresscontainercontent">
              {isRanksToAchieveVisible && (
                <div>
                  {remainingRanks.map((rank) => (
                    <div
                      key={rank}
                      style={{ color: getRankColorByRank(rank) }}
                      className="progresslevel"
                    >
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
