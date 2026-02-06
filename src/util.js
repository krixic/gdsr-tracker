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

// --- RANK REQUIREMENTS ---

const gdsrRankRequirements = {
    Bronze: 9,
    Silver: 13,
    Gold: 7,
    Emerald: 5,
    Ruby: 4,
    Diamond: 3,
    Amethyst: 2,
    Legend: 1,
    Bonus: 12,
};

const ccplRankRequirements = {
    Rock: 9,
    Copper: 11,
    Silver: 12,
    Gold: 13,
    Platinum: 13,
    Sapphire: 10,
    Emerald: 12,
    Ruby: 10,
    Diamond: 10,
    Demonite: 9,
    Crimtane: 8,
    Cobalt: 7,
    Palladium: 6,
    Mythril: 8,
    Orichalcum: 8,
    Adamantite: 8,
    Titanium: 6,
    Hallowed: 7,
    Chlorophyte: 6,
    Spectre: 5,
    Shroomite: 4,
    Luminite: 2,
    Exodium: 2,
};

export const gdsrDlcRankRequirements = {
    "Pack I": 22,
    "Pack II": 62,
    "Pack III": 41,
};

export const rankRequirements = {
    gdsr: gdsrRankRequirements,
    ccpl: ccplRankRequirements,
    dlc: gdsrDlcRankRequirements,
    // add more later
};

export const rankColors = {
    gdsr: gdsrRankColors,
    ccpl: ccplRankColors,
    dlc: gdsrRankColors,
    // add more later
};

export const isColorDark = (hex) => {
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
    return luminance < 50; // can tweak later maybe
};
