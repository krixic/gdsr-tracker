import "../App.css";
import { Levels } from "../components/levels/levels.jsx";
import { levels as levelsData, rankRequirements } from "../data/levels.js";

export const HomePage = () => {
    return (
        <div className="levelsprogress">
            <Levels
                levelsData={levelsData}
                rankRequirements={rankRequirements}
            />
        </div>
    );
};
