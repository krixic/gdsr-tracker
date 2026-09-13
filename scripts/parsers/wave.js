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

const RANK_COLOURS = Object.fromEntries(
    Object.entries(parserRankColorAliases.gdsr).map(([rank, colours]) => [
        rank,
        colours.map((colour) => colour.replace("#", "").toUpperCase()),
    ]),
);

const MAIN_RANKS = Object.keys(RANK_COLOURS);

function getRankFromColour(colour) {
    if (!colour) return null;

    for (const [rank, colours] of Object.entries(RANK_COLOURS)) {
        if (colours.includes(colour)) {
            return rank;
        }
    }

    return null;
}

function getLevel(sheet, row) {
    const cell = getCell(sheet, row, 0);
    const text = getCellValue(cell);
    const video = getHyperlink(cell);

    return parseLevel(text, video);
}

function parseMainRanks(sheet) {
    const result = [];
    let current = null;

    const range = sheet["!ref"];
    if (!range) return result;

    const decoded = XLSX.utils.decode_range(range);

    for (let row = decoded.s.r; row <= decoded.e.r; row++) {
        const cell = getCell(sheet, row, 0);
        const text = getCellValue(cell);

        if (!text) continue;

        const heading = text.match(
            new RegExp(`^(${MAIN_RANKS.join("|")})\\s+Challenges`, "i"),
        );

        if (heading) {
            const rank = heading[1];
            const requirementData = parseRequirement(text);

            current = {
                rank,
                requirement: requirementData.requirement,
                levels: [],
            };

            result.push(current);
            continue;
        }

        if (/^Bonus Challenges/i.test(text)) {
            current = null;
            break;
        }

        if (/Total\s*\(/i.test(text)) {
            continue;
        }

        if (!current) continue;

        const level = getLevel(sheet, row);

        if (level) {
            current.levels.push(level);
        }
    }

    return result;
}

function parseBonus(sheet) {
    const result = {
        rank: "Bonus",
        subranks: [],
    };

    const range = XLSX.utils.decode_range(sheet["!ref"]);

    let bonusStarted = false;
    let currentRank = null;

    for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = getCell(sheet, row, 0);
        const text = getCellValue(cell);

        if (!text) continue;

        if (/^Bonus Challenges/i.test(text)) {
            bonusStarted = true;
            continue;
        }

        if (!bonusStarted) continue;

        if (/^DLC Challenges/i.test(text)) {
            break;
        }

        if (/^Bonus Total/i.test(text)) {
            const requirementData = parseRequirement(text);

            if (requirementData.requirement !== null) {
                result.requirement = requirementData.requirement;
            }

            break;
        }

        const level = getLevel(sheet, row);

        if (!level) continue;

        const colour = getBackgroundColour(cell);
        const rank = getRankFromColour(colour);

        if (!rank) {
            console.warn(
                `[Wave] Unknown bonus colour at row ${row + 1}: ${colour}`,
            );
            continue;
        }

        if (!currentRank || currentRank.rank !== rank) {
            currentRank = {
                rank,
                levels: [],
            };

            result.subranks.push(currentRank);
        }

        currentRank.levels.push(level);
    }

    return result;
}

function parseDLC(sheet) {
    const packs = [];
    const range = XLSX.utils.decode_range(sheet["!ref"]);

    let currentPack = null;
    let currentRank = null;
    let currentColour = null;

    for (let row = range.s.r; row <= range.e.r; row++) {
        const cell = getCell(sheet, row, 0);
        const text = getCellValue(cell);

        if (!text) continue;

        const packMatch = text.match(/^DLC Challenges:\s*Pack\s+([IVXLCDM]+)/i);

        if (packMatch) {
            currentPack = {
                pack: packMatch[1].toUpperCase(),
                levels: [],
            };

            packs.push(currentPack);

            currentRank = null;
            currentColour = null;

            continue;
        }

        if (!currentPack) continue;

        if (
            /^[A-Za-z]+\s+Total\s*\(/i.test(text) ||
            /^Total\s*\(/i.test(text)
        ) {
            const requirementData = parseRequirement(text);

            if (requirementData.requirement !== null) {
                currentPack.requirement = requirementData.requirement;
            }

            currentPack = null;
            currentRank = null;
            currentColour = null;

            continue;
        }

        const level = getLevel(sheet, row);

        if (!level) continue;

        const colour = getBackgroundColour(cell);

        const rank =
            colour === currentColour
                ? currentRank?.rank
                : colour === "999999" && currentPack.levels.length === 0
                  ? "Rock"
                  : getRankFromColour(colour);

        if (!rank) {
            console.warn(
                `[Wave] Unknown DLC colour at row ${row + 1}: ${colour} - ${text}`,
            );
            continue;
        }

        if (!currentRank || currentRank.rank !== rank) {
            currentRank = {
                rank,
                levels: [],
            };

            currentPack.levels.push(currentRank);
            currentColour = colour;
        }

        currentRank.levels.push(level);
    }

    return packs;
}

function parseWave(sheet) {
    const main = parseMainRanks(sheet);
    const bonus = parseBonus(sheet);
    const dlc = parseDLC(sheet);

    return {
        main,
        bonus,
        dlc,
    };
}

export { parseWave, getRankFromColour, RANK_COLOURS };
