import * as XLSX from "xlsx";
import {
    getBackgroundColour,
    getCell,
    getCellValue,
    getHyperlink,
} from "../utils/common.js";

// die pls
const cleanLevelName = (name) =>
    name
        .replace(/levle/gi, "level")
        .replace(/\bDuplication\s+Duplication\b/gi, "Duplication")
        .replace("Gloos 👀", "Gloss")
        .replace("Violently X𝕏", "Violently X")
        .replace("Zur🅱️", "Zurb")
        .replace("Collect All Pets 🦝", "Collect All Pets")
        .trim();

const normaliseRank = (name) =>
    name
        .replace(/^\|\s*/, "")
        .replace(/\s+Tier$/i, "")
        .trim();

function parseDemons(
    sheet,
    { reverseRanks = false, progressPrefix = "nlw" } = {},
) {
    const ranks = [];
    const range = sheet["!ref"];
    if (!range) return ranks;

    let current = null;
    const seenBeginnerNames = new Set();
    const decoded = XLSX.utils.decode_range(range);

    for (let row = decoded.s.r; row <= decoded.e.r; row++) {
        const nameCell = getCell(sheet, row, 1);
        const name = getCellValue(nameCell);
        if (!name) continue;

        if (/^\|\s*/.test(name)) {
            const rankName = normaliseRank(name);
            if (
                rankName === "Shortcuts" ||
                rankName === "Not enough levels for you?" ||
                rankName === "LW Backend" ||
                rankName === "Hello"
            ) {
                current = null;
                continue;
            }
            current = {
                rank: rankName,
                requirement: null,
                headerColor: null,
                levels: [],
            };
            ranks.push(current);
            continue;
        }

        if (!current) continue;

        const cleanName = cleanLevelName(name);
        const video = getHyperlink(getCell(sheet, row, 0));
        if (cleanName === "None Yet!") continue;
        if (current.rank === "Beginner" && cleanName === "Duplication") {
            if (seenBeginnerNames.has(cleanName)) continue;
            seenBeginnerNames.add(cleanName);
        }
        const progressId = `${progressPrefix}:${current.rank}:${row + 1}:${cleanName}`;
        current.levels.push({
            name: cleanName,
            id: null,
            progressId,
            copyValue: cleanName,
            video,
        });

        if (!current.headerColor) {
            current.headerColor = getBackgroundColour(nameCell);
        }
    }

    const orderedRanks = ranks
        .filter((rank) => rank.levels.length > 0)
        .map((rank) => ({ ...rank, requirement: rank.levels.length }));

    if (reverseRanks) orderedRanks.reverse();

    return orderedRanks.sort((a, b) =>
        a.rank === "Fuck" ? 1 : b.rank === "Fuck" ? -1 : 0,
    );
}

export { parseDemons };
