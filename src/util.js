import { levelKeySyncOverrides } from "./data/hardcodedOverrides.js";

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

export const isColorYellow = (hex) => {
    if (!hex) return false;

    let c = hex.startsWith("#") ? hex.slice(1) : hex;

    if (c.length === 3) {
        c = c.replace(/./g, (x) => x + x);
    }

    if (c.length !== 6) return false;

    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max === min) return false;

    // Hue alone tells yellow (~60°) apart from orange (~30°), which the old
    // r/g/b comparisons couldn't distinguish, e.g. rgb(255, 153, 0) is a
    // clear orange but was passing as "yellow".
    let hue;
    if (max === r) hue = ((g - b) / (max - min)) % 6;
    else if (max === g) hue = (b - r) / (max - min) + 2;
    else hue = (r - g) / (max - min) + 4;
    hue *= 60;
    if (hue < 0) hue += 360;

    return hue >= 42 && hue <= 70;
};

export const getContrastTextColor = (hex) =>
    isColorDark(hex) ? "#ffffff" : "#000000";

const hexToRgb = (hex) => {
    let c = hex.startsWith("#") ? hex.slice(1) : hex;
    if (c.length === 3) c = c.replace(/./g, (x) => x + x);
    if (c.length !== 6) return null;

    return {
        r: parseInt(c.slice(0, 2), 16),
        g: parseInt(c.slice(2, 4), 16),
        b: parseInt(c.slice(4, 6), 16),
    };
};

const rgbToHsl = ({ r, g, b }) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            default:
                h = (r - g) / d + 4;
        }
        h /= 6;
    }

    return { h, s, l };
};

const hslToRgb = ({ h, s, l }) => {
    if (s === 0) {
        const v = Math.round(l * 255);
        return { r: v, g: v, b: v };
    }

    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
};

export const getYellowContrastColor = (hex, contrast = 1.2) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    const { h, s } = rgbToHsl(rgb);
    const targetL = Math.min(
        0.85,
        Math.max(0.25, 0.5 + (0.5 - luminance) * contrast),
    );
    const targetS = Math.max(s, 0.55);

    const { r, g, b } = hslToRgb({ h, s: targetS, l: targetL });
    return `rgb(${r}, ${g}, ${b})`;
};

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

const levelKeySyncOverrideMap = new Map(
    levelKeySyncOverrides.flatMap(({ id, names }) =>
        names.map((name) => [
            `${id}:${name.trim().toLocaleLowerCase()}`,
            String(id),
        ]),
    ),
);

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

    const overrideKey = levelKeySyncOverrideMap.get(`${id}:${name}`);
    if (overrideKey) return overrideKey;

    if (duplicateIds?.has(level.id)) {
        return `${id}:${name}`;
    }

    return id;
};
