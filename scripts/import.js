import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { downloadSpreadsheet, getSheet } from "./google-sheet.js";
import { parseShip } from "./parsers/ship.js";
import { parseWave } from "./parsers/wave.js";
import { parseCCPL, parseCCPLDLC } from "./parsers/ccpl.js";
import { parseDemons } from "./parsers/dl.js";
import { parseWPPL } from "./parsers/wppl.js";

const rootDir = path.resolve(".");
const dataDir = path.join(rootDir, "src", "data");
const configPath = path.join(rootDir, "data-config.json");

const config = JSON.parse(await readFile(configPath, "utf8"));

function toModule(name, data) {
    const exportName = `${name}Levels`;
    return `export const ${exportName} = ${JSON.stringify(data, null, 4)};\n\nexport default ${exportName};\n`;
}

function toDataKey(name) {
    return name
        .replace(/\bDLC\b/gi, "")
        .trim()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, character) => character.toUpperCase())
        .replace(/^./, (character) => character.toLowerCase());
}

function capitalize(name) {
    return name.replace(/^./, (character) => character.toUpperCase());
}

function convertWaveData(parsed) {
    const bonus = parsed.bonus?.subranks?.length
        ? [{ ...parsed.bonus, requirement: parsed.bonus.requirement ?? 0 }]
        : [];
    const datasets = {
        gdsr: [...parsed.main, ...bonus],
    };
    datasets.dlc = (parsed.dlc ?? []).map((pack) => ({
        type: "dlc",
        pack: pack.pack,
        name: `Pack ${pack.pack}`,
        requirement: pack.requirement ?? null,
        ranks: pack.levels,
    }));
    return datasets;
}

async function importConfiguredSheet(name, settings) {
    console.log(`Downloading ${name} from ${settings.sheetName}...`);
    const workbook = await downloadSpreadsheet(settings.spreadsheetId);
    const sheet = getSheet(workbook, settings.sheetName);

    if (name === "wave") {
        return convertWaveData(parseWave(sheet));
    }

    if (name === "ship") {
        const parsed = parseShip(sheet);
        const bonusPack = parsed.dlc.find((pack) => pack.rank === "Bonus Pack");
        const datasets = {
            ship: bonusPack ? [...parsed.main, bonusPack] : parsed.main,
            shipDlc: parsed.dlc.filter((item) => item !== bonusPack),
        };
        return datasets;
    }

    if (name === "ccpl") {
        const datasets = {
            ccpl: parseCCPL(sheet),
        };
        for (const sheetName of settings.dlcSheetNames ?? []) {
            datasets[`ccpl${capitalize(toDataKey(sheetName))}`] = parseCCPLDLC(
                getSheet(workbook, sheetName),
                sheetName,
            );
        }
        return datasets;
    }

    if (name === "nlw") {
        return { nlw: parseDemons(sheet) };
    }

    if (name === "lw") {
        return {
            lw: parseDemons(sheet, {
                reverseRanks: true,
                progressPrefix: "lw",
            }),
        };
    }

    if (name === "wppl") {
        return { wppl: parseWPPL(sheet) };
    }

    throw new Error(`No parser configured for "${name}"`);
}

const importedDatasets = {};

for (const [name, settings] of Object.entries(config)) {
    Object.assign(
        importedDatasets,
        await importConfiguredSheet(name, settings),
    );
}

for (const [datasetName, data] of Object.entries(importedDatasets)) {
    await writeFile(
        path.join(dataDir, `${datasetName}.js`),
        toModule(datasetName, data),
        "utf8",
    );
    console.log(`Wrote ${datasetName}.js (${data.length} top-level entries)`);
}
