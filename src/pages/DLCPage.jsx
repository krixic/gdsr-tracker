import "../App.css";
import { Levels } from "../components/levels/levels.jsx";
import {
  dlcLevels as dlcLevelsData,
  dlcRankRequirements,
} from "../data/dlc.js";

export const DLCPage = () => {
  return (
    <div className="levelsprogress">
      <Levels
        levelsData={dlcLevelsData}
        rankRequirements={dlcRankRequirements}
      />
    </div>
  );
};
