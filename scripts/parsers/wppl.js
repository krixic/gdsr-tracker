import * as XLSX from "xlsx";

import {
    getCell,
    getCellValue,
    getHyperlink,
    getBackgroundColour,
    parseLevel,
    parseRequirement,
} from "../utils/common.js";

function getLevel(sheet, row) {
    const cell = getCell(sheet, row, 0);
    const text = getCellValue(cell);
    const video = getHyperlink(cell);

    return parseLevel(text, video);
}

const isHeading = (text) => /\p{S}/u.test(text);

const stripDecoration = (text) => {
    const cleaned = text
        .replace(/[^\p{L}\p{N}\s'-]/gu, "")
        .replace(/\s+/g, " ")
        .trim();

    return cleaned.replace(
        /\b\w+/g,
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
};

function parseWPPL(sheet) {
    const ranks = [];
    const range = sheet["!ref"];

    if (!range) return ranks;

    const decoded = XLSX.utils.decode_range(range);
    let current = null;

    for (let row = decoded.s.r; row <= decoded.e.r; row++) {
        const cell = getCell(sheet, row, 0);
        const text = getCellValue(cell);

        if (!text) continue;

        if (isHeading(text)) {
            current = {
                rank: stripDecoration(text),
                requirement: null,
                headerColor: getBackgroundColour(cell),
                levels: [],
            };

            ranks.push(current);
            continue;
        }

        if (!current) continue;

        if (/total/i.test(text)) {
            current = null;
            continue;
        }

        if (current.requirement === null && current.levels.length === 0) {
            const requirementData = parseRequirement(text);

            if (requirementData.requirement !== null) {
                current.requirement = requirementData.requirement;
                continue;
            }

            if (/^roll\b/i.test(text)) continue;
        }

        const level = getLevel(sheet, row);

        if (level) current.levels.push(level);
    }

    return ranks;
}

export { parseWPPL };
