import { getDuplicateIds, getLevelKey, isColorDark } from "../util.js";

export const getAllLevels = (rank) =>
    rank.levels?.length
        ? rank.levels
        : (rank.ranks?.flatMap((s) => s.levels) ??
          rank.subranks?.flatMap((s) => s.levels) ??
          []);

export const getCountedLevels = (rank) =>
    rank.excludeFromTotal ? [] : getAllLevels(rank);

export const countCompletedInRank = (rank, progress, duplicateIds) =>
    getAllLevels(rank).filter(
        (level) => progress[getLevelKey(level, duplicateIds)] === 100,
    ).length;

export const sumAttempts = (levels, attempts, duplicateIds) =>
    levels.reduce(
        (sum, level) =>
            sum + (Number(attempts[getLevelKey(level, duplicateIds)]) || 0),
        0,
    );

export const hexToRgba = (hex, alpha = 0.5) => {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    let c = hex.replace("#", "");
    if (c.length === 3)
        c = c
            .split("")
            .map((x) => x + x)
            .join("");
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getRankStatus = ({
    rank,
    progress,
    activeTheme,
    duplicateIds,
}) => {
    const allLevels = getAllLevels(rank);
    const completed = countCompletedInRank(rank, progress, duplicateIds);
    const requirement = rank.requirement || 0;
    const rankLabel = rank.rank ?? rank.name;
    const nestedRanks = rank.ranks ?? rank.subranks;

    if (
        rank.excludeFromTotal &&
        (!nestedRanks || nestedRanks.length === 0) &&
        completed < allLevels.length
    ) {
        return "border-transparent";
    }

    if (completed >= requirement && completed < allLevels.length)
        return "border-rank-complete";
    if (completed === allLevels.length) {
        return isColorDark(rank.headerColor || activeTheme[rankLabel], 50)
            ? "border-white"
            : "border-black";
    }
    return "border-transparent";
};

export const getRankMax = (completed, requirement, total, excludeFromTotal) =>
    excludeFromTotal || completed >= requirement ? total : requirement;

export const migrateProgressKeys = (data, levels) => {
    const duplicateIds = getDuplicateIds(levels);

    const suffixAliases = new Map();
    const canonicalKeysById = new Map();

    levels.forEach((level) => {
        if (!Number.isInteger(level.id)) return;

        const canonicalKey = getLevelKey(level, duplicateIds);
        const id = String(level.id);

        if (!canonicalKeysById.has(id)) {
            canonicalKeysById.set(id, new Set());
        }

        canonicalKeysById.get(id).add(canonicalKey);

        const name =
            typeof level.name === "string"
                ? level.name.trim().toLocaleLowerCase()
                : "";

        if (name) {
            suffixAliases.set(`:${name}:${id}`, canonicalKey);
        }
    });

    const migrated = { ...data };

    Object.keys(data).forEach((key) => {
        let isCanonical = false;

        for (const keys of canonicalKeysById.values()) {
            if (keys.has(key)) {
                isCanonical = true;
                break;
            }
        }

        if (isCanonical) return;

        const normalizedKey = key.toLocaleLowerCase();

        const namedCanonicalKey = [...suffixAliases.entries()].find(
            ([suffix]) => normalizedKey.endsWith(suffix),
        )?.[1];

        if (namedCanonicalKey) {
            migrated[namedCanonicalKey] = Math.max(
                Number(migrated[namedCanonicalKey]) || 0,
                Number(data[key]) || 0,
            );

            delete migrated[key];
            return;
        }

        const possibleKeys = canonicalKeysById.get(key);

        if (possibleKeys?.size === 1) {
            const canonicalKey = [...possibleKeys][0];

            if (canonicalKey !== key) {
                migrated[canonicalKey] = Math.max(
                    Number(migrated[canonicalKey]) || 0,
                    Number(data[key]) || 0,
                );

                delete migrated[key];
            }
        }
    });

    return migrated;
};
