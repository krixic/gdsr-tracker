import React, { useState, useEffect } from "react";
import "./levels.css";
import { levels } from "../../data/levels.js";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const Levels = () => {
  const initialCompletedLevels =
    JSON.parse(localStorage.getItem("completedLevels")) || {};
  const initialInputValues =
    JSON.parse(localStorage.getItem("inputValues")) || {};
  const initialAttempts = JSON.parse(localStorage.getItem("attempts")) || {};

  const [completedLevels, setCompletedLevels] = useState(
    initialCompletedLevels
  );
  const [inputValues, setInputValues] = useState(initialInputValues);
  const [attempts, setAttempts] = useState(initialAttempts);

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

  const handleAttemptsChange = (level, value) => {
    setAttempts((prevAttempts) => ({
      ...prevAttempts,
      [level]: value,
    }));
  };

  useEffect(() => {
    localStorage.setItem("completedLevels", JSON.stringify(completedLevels));
    localStorage.setItem("inputValues", JSON.stringify(inputValues));
    localStorage.setItem("attempts", JSON.stringify(attempts));
  }, [completedLevels, inputValues, attempts]);

  const [currentCarouselPage, setCurrentCarouselPage] = useState(
    parseInt(localStorage.getItem("currentCarouselPage")) || 0
  );

  // Function to handle changes in the current carousel page
  const handleCarouselPageChange = (index) => {
    setCurrentCarouselPage(index);
    // Save the current carousel page in localStorage
    localStorage.setItem("currentCarouselPage", index);
  };

  return (
    <div className="levels">
      <Carousel
        showStatus={false}
        showThumbs={false}
        showArrows={true}
        infiniteLoop
        showIndicators={false}
        width="100%"
        selectedItem={currentCarouselPage} // Set the selected item to the current page
        onChange={handleCarouselPageChange} // Handle changes in the current page
      >
        {Object.keys(levels[0]).map((rank) => (
          <div key={rank}>
            <div className="nameprogress">
              <div
                className="rank"
                style={{ backgroundColor: getRankBackgroundColor(rank) }}
              >
                {rank}
              </div>
              <div
                className="progressypoo"
                style={{ backgroundColor: getRankBackgroundColor(rank) }}
              >
                <div className="progressfart">Progress</div>{" "}
                <div className="progressfart">Atts</div>
              </div>
            </div>

            {levels[0][rank].map((level, index) => (
              <div className="nameprogress">
                <div
                  key={index}
                  className={`level ${completedLevels[level]}`}
                  onClick={() => toggleStatus(level)}
                >
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
                      onChange={(e) => handleInputChange(level, e.target.value)}
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      className="progressinput"
                      value={attempts[level] || ""}
                      placeholder="0"
                      onChange={(e) =>
                        handleAttemptsChange(level, e.target.value)
                      }
                    />
                  </label>
                </form>
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const getRankBackgroundColor = (rankText) => {
  switch (rankText) {
    case "Bronze":
      return "#dd7e6b";
    case "Silver":
      return "#b7b7b7";
    case "Gold":
      return "#f1c232";
    case "Emerald":
      return "#6aa84f";
    case "Ruby":
      return "#cc0000";
    case "Diamond":
      return "#3d85c6";
    case "Amethyst":
      return "#ff00ff";
    case "Legend":
      return "#000000";
    case "Bonus":
      return "#b4a7d6";

    default:
      return "rgb(196, 34, 34)";
  }
};
