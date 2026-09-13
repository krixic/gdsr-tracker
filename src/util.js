export const utilityPages = [
    { name: "Stats", path: "/stats" },
    { name: "Info", path: "/info" },
    { name: "Settings", path: "/settings" },
    { name: "API", path: "/api" },
];

// --- COLOURS ---

const gdsrRankColors = {
    Rock: "#999999",
    Bronze: "#dd7e6b",
    Silver: "#b7b7b7",
    Gold: "#f1c232",
    Emerald: "#6aa84f",
    Ruby: "#cc0000",
    Diamond: "#3d85c6",
    Amethyst: "#ff00ff",
    Legend: "#000000",
    Obsidian: "#000000",
    Bonus: "#b4a7d6",
    "Pack I": "#bf9000",
    "Pack II": "#e69138",
    "Pack III": "#7aecec",
};

const ccplRankColors = {
    Rock: "#c0aa9d",
    Copper: "#b45f06",
    Silver: "#cccccc",
    Gold: "#ffd966",
    Platinum: "#b4a7d6",
    Sapphire: "#0036ff",
    Emerald: "#67c73d",
    Ruby: "#cc0000",
    Diamond: "#94edfc",
    Demonite: "#6052cf",
    Crimtane: "#a22626",
    Cobalt: "#082a5b",
    Palladium: "#ff9900",
    Mythril: "#59a998",
    Orichalcum: "#ff00ff",
    Adamantite: "#960b2e",
    Titanium: "#8e8eab",
    Hallowed: "#decf67",
    Chlorophyte: "#00ff00",
    Spectre: "#6ad9ff",
    Shroomite: "#000184",
    Luminite: "#16e2a6",
    Exodium: "#000000",
};

export const nlwRankColors = {
    Fuck: "#000000",
    Beginner: "#4a86e8",
    Easy: "#00ffff",
    Medium: "#00ff00",
    Hard: "#ffff00",
    "Very Hard": "#ff9900",
    Insane: "#ff0000",
    Extreme: "#ff00ff",
};

export const parserRankColorAliases = {
    gdsr: {
        Rock: ["#999999", "#B7B7B7"],
        Bronze: ["#DD7E6B", "#E6B8AF"],
        Silver: ["#B7B7B7", "#D9D9D9"],
        Gold: ["#F1C232", "#FFE599"],
        Emerald: ["#6AA84F", "#B6D7A8", "#93C47D"],
        Ruby: ["#CC0000", "#E06666", "#EA9999"],
        Diamond: ["#3D85C6", "#9FC5E8"],
        Amethyst: ["#FF00FF", "#FFACEB", "#FF3FC8"],
        Legend: ["#000000", "#171717"],
        Obsidian: ["#000000", "#434343"],
    },
};

export const rankColors = {
    gdsr: gdsrRankColors,
    ccpl: ccplRankColors,
    dlc: gdsrRankColors,
    ship: gdsrRankColors,
    shipDlc: gdsrRankColors,
    ccplDlc: ccplRankColors,
    ccplTiny: ccplRankColors,
    ccplConsistency: ccplRankColors,
    ccplSecret: ccplRankColors,
    nlw: nlwRankColors,
    // add more later
};

export const isColorDark = (hex, threshold = 225) => {
    if (!hex) return true;
    let c = hex.replace("#", "");
    if (c.length === 3)
        c = c
            .split("")
            .map((x) => x + x)
            .join("");
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < threshold;
};

export const getContrastTextColor = (hex) =>
    isColorDark(hex) ? "#ffffff" : "#000000";

export const getDuplicateIds = (levels) => {
    const counts = new Map();

    levels.forEach((level) => {
        if (!Number.isInteger(level.id)) return;
        counts.set(level.id, (counts.get(level.id) ?? 0) + 1);
    });

    return new Set(
        [...counts].filter(([, count]) => count > 1).map(([id]) => id),
    );
};

export const getLevelKey = (level, duplicateIds) => {
    if (level.progressId) return level.progressId;

    const id = String(level.id);
    const name =
        typeof level.name === "string"
            ? level.name.trim().toLocaleLowerCase()
            : "";

    if (!name) {
        return id;
    }

    if (duplicateIds?.has(level.id)) {
        return `${id}:${name}`;
    }

    return id;
};
