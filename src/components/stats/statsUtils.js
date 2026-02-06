export const getAllLevels = (rank) =>
    rank.levels ?? rank.subranks?.flatMap((s) => s.levels) ?? [];

export const sumAttempts = (levels, attempts) =>
    levels.reduce((sum, level) => sum + (Number(attempts[level.id]) || 0), 0);

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
