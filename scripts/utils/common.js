function getCell(sheet, row, column = 0) {
    const cellAddress = `${columnToLetter(column)}${row + 1}`;
    return sheet[cellAddress];
}

function columnToLetter(column) {
    let result = "";
    let n = column + 1;

    while (n > 0) {
        const remainder = (n - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        n = Math.floor((n - 1) / 26);
    }

    return result;
}

function getCellValue(cell) {
    if (!cell) return "";

    if (cell.v !== undefined && cell.v !== null) {
        return String(cell.v).trim();
    }

    if (cell.w !== undefined && cell.w !== null) {
        return String(cell.w).trim();
    }

    return "";
}

function getHyperlink(cell) {
    if (!cell) return "";

    if (cell.l?.Target) {
        return cell.l.Target;
    }

    if (cell.hyperlink?.target) {
        return cell.hyperlink.target;
    }

    return "";
}

function getBackgroundColour(cell) {
    if (!cell) return null;

    const fill = cell.s?.fill || cell.s?.patternFill || cell.s || cell.fill;

    if (!fill) return null;

    const colour = fill.fgColor || fill.bgColor;

    if (!colour) return null;

    if (colour.rgb) {
        return normaliseColour(colour.rgb);
    }

    return null;
}

function normaliseColour(colour) {
    return String(colour).replace("#", "").toUpperCase();
}

function parseLevel(text, video = "") {
    if (!text) return null;

    const match = text.match(/^(.+?)\s*\((\d+)\)\s*$/);

    if (!match) return null;

    return {
        name: match[1].trim(),
        id: Number(match[2]),
        video: video || "",
    };
}

function parseRequirement(text) {
    if (!text) {
        return {
            requirement: null,
            clearAll: false,
            excludeFromTotal: false,
        };
    }

    const upper = text.toUpperCase();

    if (upper.includes("CLEAR ALL")) {
        return {
            requirement: null,
            clearAll: true,
            excludeFromTotal: upper.includes("GRAND TOTAL ONLY"),
        };
    }

    const match = text.match(/(?:CLEAR|ROLL)\s+(?:ANY\s+)?(\d+)/i);

    if (match) {
        return {
            requirement: Number(match[1]),
            clearAll: false,
            excludeFromTotal: false,
        };
    }

    if (/(?:CLEAR|ROLL)\b.*\bANY\b/i.test(text)) {
        return {
            requirement: 1,
            clearAll: false,
            excludeFromTotal: false,
        };
    }

    const totalMatch = text.match(/OUT\s+OF\s+(\d+)/i);
    if (totalMatch) {
        return {
            requirement: Number(totalMatch[1]),
            clearAll: false,
            excludeFromTotal: false,
        };
    }

    return {
        requirement: null,
        clearAll: false,
        excludeFromTotal: false,
    };
}

function cleanObject(object) {
    return JSON.parse(JSON.stringify(object));
}

export {
    getCell,
    getCellValue,
    getHyperlink,
    getBackgroundColour,
    normaliseColour,
    parseLevel,
    parseRequirement,
    cleanObject,
};
