import { gdsrLevels } from "./gdsr.js";
import { dlcLevels } from "./dlc.js";
import { ccplLevels } from "./ccpl.js";
import { shipLevels } from "./ship.js";
import { shipDlcLevels } from "./shipDlc.js";
import { ccplTinyLevels } from "./ccplTiny.js";
import { ccplConsistencyLevels } from "./ccplConsistency.js";
import { ccplSecretLevels } from "./ccplSecret.js";
import { nlwLevels } from "./nlw.js";
import { lwLevels } from "./lw.js";
import { wpplLevels } from "./wppl.js";
import { getDuplicateIds } from "../util.js";

export const listConfigs = [
    // Keep the GDSR dropdown in Wave, Ship, DLC order.
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
        key: "ship",
        main: "GDSR",
        sub: "Ship",
        path: "/ship",
        title: "GDSR",
        levels: shipLevels,
        type: "ship",
    },
    {
        key: "shipDlc",
        main: "GDSR",
        sub: "Ship DLC",
        treePath: ["GDSR", "Ship", "DLC"],
        path: "/ship/dlc",
        title: "Ship DLC",
        levels: shipDlcLevels,
        type: "shipDlc",
    },
    {
        key: "dlc",
        main: "GDSR",
        sub: "DLC",
        summaryLabel: "Wave DLC",
        treePath: ["GDSR", "Wave", "DLC"],
        path: "/dlc",
        title: "DLC",
        levels: dlcLevels,
        type: "dlc",
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
    {
        key: "ccplTiny",
        main: "CCPL",
        sub: "Tiny DLC",
        treePath: ["CCPL", "DLC", "Tiny"],
        path: "/ccpl/dlc/tiny",
        title: "Tiny DLC",
        levels: ccplTinyLevels,
        type: "ccplTiny",
    },
    {
        key: "ccplConsistency",
        main: "CCPL",
        sub: "Consistency DLC",
        treePath: ["CCPL", "DLC", "Consistency"],
        path: "/ccpl/dlc/consistency",
        title: "Consistency DLC",
        levels: ccplConsistencyLevels,
        type: "ccplConsistency",
    },
    {
        key: "ccplSecret",
        main: "CCPL",
        sub: "Secret DLC",
        treePath: ["CCPL", "DLC", "Secret"],
        path: "/ccpl/dlc/secret",
        title: "Secret DLC",
        levels: ccplSecretLevels,
        type: "ccplSecret",
    },
    {
        key: "wppl",
        main: "WPPL",
        path: "/wppl",
        title: "WPPL",
        levels: wpplLevels,
        type: "wppl",
    },
    {
        key: "nlw",
        main: "DL",
        sub: "NLW",
        treePath: ["DL", "NLW"],
        path: "/dl/nlw",
        title: "NLW",
        levels: nlwLevels,
        type: "dl",
        optional: true,
    },
    {
        key: "lw",
        main: "DL",
        sub: "LW",
        treePath: ["DL", "LW"],
        path: "/dl/lw",
        title: "LW",
        levels: lwLevels,
        type: "dl",
        optional: true,
    },
];

export const listPages = listConfigs.map(({ main, sub, path }) => ({
    main,
    sub,
    path,
}));

export const getListPathLabels = (config) =>
    config.treePath ?? [config.main, config.sub].filter(Boolean);

export const buildListTree = (configs) => {
    const roots = [];

    configs.forEach((config) => {
        const pathLabels = getListPathLabels(config);
        let children = roots;

        pathLabels.forEach((label, idx) => {
            const id = pathLabels.slice(0, idx + 1).join("/");
            let node = children.find((item) => item.id === id);

            if (!node) {
                node = {
                    id,
                    label,
                    children: [],
                    config: null,
                };
                children.push(node);
            }

            if (idx === pathLabels.length - 1) {
                node.config = config;
            }

            children = node.children;
        });
    });

    return roots;
};

const rootLabels = listConfigs
    .map((config) => getListPathLabels(config)[0])
    .filter((label, idx, labels) => labels.indexOf(label) === idx);

export const orderedListConfigs = rootLabels.flatMap((rootLabel) =>
    listConfigs.filter((config) => getListPathLabels(config)[0] === rootLabel),
);

export const getListTree = (includeOptional = true) =>
    buildListTree(
        orderedListConfigs.filter(
            (config) => includeOptional || !config.optional,
        ),
    );

export const listTree = getListTree(false);

const flattenRankLevels = (rank) =>
    rank.levels?.length
        ? rank.levels
        : (rank.ranks?.flatMap((sub) => sub.levels) ??
          rank.subranks?.flatMap((sub) => sub.levels) ??
          []);

// The full set of levels across every list, used to detect level ids that
// appear more than once site-wide so they can be tracked independently.
export const allLevels = listConfigs.flatMap((config) =>
    config.levels.flatMap(flattenRankLevels),
);

export const duplicateLevelIds = getDuplicateIds(allLevels);
