import * as XLSX from "xlsx";

async function downloadSpreadsheet(spreadsheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to download spreadsheet: ${response.status} ${response.statusText}`,
        );
    }

    const data = new Uint8Array(await response.arrayBuffer());

    return XLSX.read(data, {
        type: "array",
        cellStyles: true,
        cellHTML: false,
        cellFormula: true,
        cellText: true,
    });
}

function getSheet(workbook, sheetName) {
    const exactSheet = workbook.Sheets[sheetName];
    if (exactSheet) return exactSheet;

    const requestedWords = sheetName
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 2 && !["the", "sheet"].includes(word));
    const candidates = workbook.SheetNames.map((name) => {
        const lowerName = name.toLowerCase();
        const score = requestedWords.reduce(
            (total, word) => total + (lowerName.includes(word) ? 1 : 0),
            0,
        );
        return { name, score };
    })
        .filter((candidate) => candidate.score > 0)
        .sort((a, b) => b.score - a.score);

    if (candidates.length > 0) {
        const selected = candidates[0];
        console.warn(
            `Sheet "${sheetName}" not found, using "${selected.name}" instead.`,
        );
        return workbook.Sheets[selected.name];
    }

    const fallback = workbook.SheetNames.find(
        (name) => !/outdated|archive|old/i.test(name),
    );
    if (fallback) {
        console.warn(
            `Sheet "${sheetName}" not found, using active sheet "${fallback}" instead`,
        );
        return workbook.Sheets[fallback];
    }

    throw new Error(
        `Sheet "${sheetName}" not found.\nAvailable sheets: ${workbook.SheetNames.join(", ")}`,
    );
}

export { downloadSpreadsheet, getSheet };
