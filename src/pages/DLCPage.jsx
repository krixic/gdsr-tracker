import "../App.css";
import { Levels } from "../components/levels/levels.jsx";
import { levels } from "../data/levels.js";
// import { normalizeDlcLevels } from "../data/utils";

// const normalizedDlc = normalizeDlcLevels(dlcLevels);

export const DLCPage = () => {
    return (
        <div className="levelsprogress">
            <Levels levelsData={levels} />
        </div>
    );
};
