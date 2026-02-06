import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.resolve("src/data");
const files = await readdir(dataDir);

const datasetFiles = files
    .filter((file) => file.endsWith(".js"))
    .filter((file) => {
        const lower = file.toLowerCase();
        return lower !== "index.js" && lower !== "listconfig.js";
    })
    .sort((a, b) => a.localeCompare(b));

const imports = datasetFiles
    .map((file) => {
        const name = path.basename(file, ".js");
        return `import ${name} from "./${file}";`;
    })
    .join("\n");

const entries = datasetFiles
    .map((file) => {
        const name = path.basename(file, ".js");
        return `    ${name},`;
    })
    .join("\n");

const content = `${imports}

const datasets = {
${entries}
};

export default datasets;
`;

await writeFile(path.join(dataDir, "index.js"), content, "utf8");
