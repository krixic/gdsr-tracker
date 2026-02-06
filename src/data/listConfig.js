import { gdsrLevels } from "./gdsr.js";
import { dlcLevels } from "./dlc.js";
import { ccplLevels } from "./ccpl.js";

export const listConfigs = [
    // put mains in reverse order
    {
        key: "dlc",
        main: "GDSR",
        sub: "DLC",
        path: "/dlc",
        title: "DLC",
        levels: dlcLevels,
        type: "dlc",
    },
    {
        key: "gdsr",
        main: "GDSR",
        sub: "Wave",
        path: "/",
        title: "GDSR",
        levels: gdsrLevels,
        type: "gdsr",
    },

    {
        key: "ccpl",
        main: "CCPL",
        sub: "Wave",
        path: "/ccpl",
        title: "CCPL",
        levels: ccplLevels,
        type: "ccpl",
    },
];

export const listPages = listConfigs.map(({ main, sub, path }) => ({
    main,
    sub,
    path,
}));
