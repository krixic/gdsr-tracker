import * as XLSX from "xlsx";
import {
    getCell,
    getCellValue,
    getHyperlink,
    getBackgroundColour,
    parseRequirement,
} from "../utils/common.js";

function getLevel(sheet, row) {
    const nameCell = getCell(sheet, row, 0);
    const idCell = getCell(sheet, row, 1);
    const name = getCellValue(nameCell);
    const id = Number(getCellValue(idCell));

    if (!name || !Number.isInteger(id) || id <= 0) return null;

    return {
        name,
        id,
        video: getHyperlink(nameCell),
    };
}

function parseRanks(sheet) {
    const ranks = [];
    const range = sheet["!ref"];
    if (!range) return ranks;

    let current = null;
    const decoded = XLSX.utils.decode_range(range);

    for (let row = decoded.s.r; row <= decoded.e.r; row++) {
        const cell = getCell(sheet, row, 0);
        const text = getCellValue(cell);
        if (!text) continue;

        const requirementData = parseRequirement(text);
        const heading = text.match(/^(.+?)\s*-\s*clear\b/i);
        if (
            heading &&
            (requirementData.requirement || requirementData.clearAll)
        ) {
            current = {
                rank: heading[1].trim(),
                requirement: requirementData.requirement,
                headerColor: getBackgroundColour(cell),
                levels: [],
                ...(requirementData.excludeFromTotal
                    ? { excludeFromTotal: true }
                    : {}),
            };
            ranks.push(current);
            continue;
        }

        if (/total\s*\(/i.test(text)) continue;

        const level = getLevel(sheet, row);
        if (level && current) current.levels.push(level);
    }

    return ranks;
}

function parseCCPL(sheet) {
    return parseRanks(sheet);
}

function parseCCPLDLC(sheet, name) {
    const ranks = parseRanks(sheet);

    return ranks.map((rank) => ({ ...rank, pack: name }));
}

export { parseCCPL, parseCCPLDLC };
