import { isColorDark } from "../../util.js";

export const getAllLevels = (rank) =>
    rank.levels ?? rank.subranks?.flatMap((s) => s.levels) ?? [];

export const countCompletedInRank = (rank, progress) =>
    getAllLevels(rank).filter((level) => progress[level.id] === 100).length;

export const getRankStatus = ({
    rank,
    progress,
    activeRequirements,
    activeTheme,
}) => {
    const allLevels = getAllLevels(rank);
    const completed = countCompletedInRank(rank, progress);
    const requirement = activeRequirements[rank.rank] || 0;

    if (completed >= requirement && completed < allLevels.length)
        return "border-rank-complete";
    if (completed === allLevels.length) {
        return isColorDark(activeTheme[rank.rank])
            ? "border-white"
            : "border-black";
    }
    return "border-transparent";
};

export const getRankMax = (completed, requirement, total) =>
    completed >= requirement ? total : requirement;
