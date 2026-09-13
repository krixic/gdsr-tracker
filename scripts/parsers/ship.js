import * as XLSX from "xlsx";

import {
    getCell,
    getCellValue,
    getHyperlink,
    getBackgroundColour,
    parseLevel,
    parseRequirement,
} from "../utils/common.js";

import { parserRankColorAliases } from "../../src/util.js";

const HEADING_PATTERN = /^(.+?)\s+Challenges\b/i;
const PACK_PATTERN = /^(.+?)\s+PACK\b/i;
const DLC_PATTERN = /^DLC\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)\s*-\s*(.+)$/i;

const RANK_COLOURS = Object.fromEntries(
    Object.entries(parserRankColorAliases.gdsr).map(([rank, colours]) => [
        rank,
        colours.map((colour) => colour.replace("#", "").toUpperCase()),
    ]),
);

const MAIN_RANKS = [
    "Rock",
    "Bronze",
    "Silver",
    "Gold",
    "Emerald",
    "Ruby",
    "Diamond",
    "Amethyst",
    "Obsidian",
];

function getRankFromColour(colour) {
    if (!colour) return null;

    for (const [rank, colours] of Object.entries(RANK_COLOURS)) {
        if (colours.includes(colour)) {
            return rank;
        }
    }

    return null;
}

function normaliseRankName(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normaliseSectionName(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalisePackName(name) {
    return normaliseSectionName(name).replace(
        /\b(I|II|III|IV|V|VI|VII|VIII|IX|X)\b/gi,
        (roman) => roman.toUpperCase(),
    );
}

function flattenSingleSubrank(pack) {
    if (!pack.subranks?.length) {
        delete pack.subranks;
        return;
    }

    if (pack.subranks.length !== 1) {
        delete pack.levels;
        return;
    }

    pack.levels = pack.subranks[0].levels;
    delete pack.subranks;
}

function parseShip(sheet) {
    const main = [];
    const dlc = [];

    const range = sheet["!ref"];
    if (!range) return { main, dlc };

    let current = null;
    let currentSubrank = null;
    let inDlc = false;

    const decoded = XLSX.utils.decode_range(range);

    for (let row = decoded.s.r; row <= decoded.e.r; row++) {
        const cell = getCell(sheet, row, 0);
        const text = getCellValue(cell);

        if (!text) continue;

        const heading = text.match(HEADING_PATTERN);

        if (heading) {
            const rank = normaliseRankName(heading[1]);

            if (!MAIN_RANKS.includes(rank)) continue;

            const requirementData = parseRequirement(text);

            current = {
                rank,
                requirement: requirementData.requirement,
                ...(requirementData.excludeFromTotal
                    ? { excludeFromTotal: true }
                    : {}),
                levels: [],
            };

            main.push(current);

            currentSubrank = null;
            inDlc = false;

            continue;
        }

        const packHeading = text.match(PACK_PATTERN);

        if (packHeading) {
            const packName = normalisePackName(packHeading[1]);

            current = {
                rank: `${packName} Pack`,
                requirement: null,
                headerColor: getBackgroundColour(cell),
                levels: [],
                subranks: [],
                noPlusRanks: true,
            };

            dlc.push(current);

            inDlc = true;
            currentSubrank = null;

            continue;
        }

        const dlcHeading = text.match(DLC_PATTERN);

        if (dlcHeading) {
            const roman = dlcHeading[1].toUpperCase();
            const name = normaliseSectionName(dlcHeading[2]);

            current = {
                rank: `DLC ${roman} - ${name}`,
                requirement: null,
                headerColor: getBackgroundColour(cell),
                levels: [],
                subranks: [],
                noPlusRanks: true,
            };

            dlc.push(current);

            inDlc = true;
            currentSubrank = null;

            continue;
        }

        if (current && /^CLEAR\b/i.test(text)) {
            const requirementData = parseRequirement(text);

            current.requirement = requirementData.requirement;

            if (requirementData.excludeFromTotal) {
                current.excludeFromTotal = true;
            }

            if (current.subranks && requirementData.excludeFromTotal) {
                current.excludeFromTotal = true;
            }

            continue;
        }

        if (/^(Bonus|DLC)\s+Challenges/i.test(text)) {
            current = null;
            currentSubrank = null;
            continue;
        }

        if (/Total\s*\(/i.test(text)) {
            const requirementData = parseRequirement(text);

            if (current?.subranks && requirementData.requirement !== null) {
                current.requirement = requirementData.requirement;
            }

            if (current?.subranks) {
                flattenSingleSubrank(current);
            }

            current = null;
            currentSubrank = null;

            continue;
        }

        if (!current) continue;

        const levelText = parseLevel(text, getHyperlink(cell));

        if (!levelText) continue;

        if (!inDlc) {
            current.levels.push(levelText);
            continue;
        }

        if (!current.subranks) {
            current.levels.push(levelText);
            continue;
        }

        const colour = getBackgroundColour(cell);
        const subrankName = getRankFromColour(colour);

        if (!subrankName) {
            current.levels.push(levelText);
            continue;
        }

        if (!currentSubrank || currentSubrank.rank !== subrankName) {
            currentSubrank = {
                rank: subrankName,
                levels: [],
            };

            current.subranks.push(currentSubrank);
        }

        currentSubrank.levels.push(levelText);
    }

    return { main, dlc };
}

export { parseShip };
