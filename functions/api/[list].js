import datasets from "../../src/data/index.js";

export async function onRequest({ request, params }) {
    const listParam = params.list || "";
    const listName = listParam.toLowerCase();
    const data = datasets[listName];

    if (!data) {
        return new Response(
            JSON.stringify({
                error: "List not found",
                message: `Available lists: ${Object.keys(datasets).join(", ")}`,
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
    }

    const url = new URL(request.url);

    const showRanks = url.searchParams.get("ranks") === "true";
    const id = url.searchParams.get("id");
    const rank = url.searchParams.get("rank");
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "0", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    const sortBy = url.searchParams.get("sortBy");

    if (showRanks) {
        const { ranks, subranks } = extractRanks(data);
        return jsonResponse({
            list: listName,
            ranks,
            subranks,
        });
    }

    let result = JSON.parse(JSON.stringify(data));
    const totalCount = countTotalLevels(data);

    if (id || search || sortBy) {
        result = filterAndProcessRanks(result, { id, search, sortBy });
    }

    if (rank) {
        result = filterByRankName(result, rank);
    }

    const filteredCount = countTotalLevels(result);

    const paginated =
        limit > 0 || offset > 0
            ? paginateRanks(result, limit || filteredCount, offset)
            : result;

    const paginatedCount = countTotalLevels(paginated);

    return jsonResponse({
        list: listName,
        count: paginatedCount,
        total: totalCount,
        found: filteredCount,
        data: paginated,
    });
}

function extractRanks(data) {
    const ranks = new Set();
    const subranks = {};

    data.forEach((item) => {
        if (item.rank) {
            ranks.add(item.rank);
        }

        if (item.subranks && Array.isArray(item.subranks)) {
            const subrankNames = item.subranks
                .map((subrank) => subrank.rank)
                .filter(Boolean);

            if (subrankNames.length > 0) {
                subranks[item.rank] = Array.from(new Set(subrankNames));
            }
        }
    });

    return {
        ranks: Array.from(ranks),
        subranks,
    };
}

function countTotalLevels(data) {
    let count = 0;

    data.forEach((item) => {
        if (item.levels && Array.isArray(item.levels)) {
            count += item.levels.length;
        } else if (item.subranks && Array.isArray(item.subranks)) {
            item.subranks.forEach((subrank) => {
                if (subrank.levels && Array.isArray(subrank.levels)) {
                    count += subrank.levels.length;
                }
            });
        }
    });

    return count;
}

function filterAndProcessRanks(data, filters) {
    const { id, search, sortBy } = filters;

    return data
        .map((rankItem) => {
            const newRankItem = { ...rankItem };

            if (rankItem.levels && Array.isArray(rankItem.levels)) {
                let levels = [...rankItem.levels];

                if (id) {
                    levels = levels.filter(
                        (level) => String(level.id).trim() === id.trim(),
                    );
                }

                if (search) {
                    const query = decodeURIComponent(search)
                        .replace(/['"]+/g, "")
                        .trim()
                        .toLowerCase();
                    levels = levels.filter((level) => {
                        const name = String(level.name || "").toLowerCase();
                        return name.includes(query);
                    });
                }

                if (sortBy) {
                    levels = sortLevels(levels, sortBy);
                }

                newRankItem.levels = levels;
            } else if (rankItem.subranks && Array.isArray(rankItem.subranks)) {
                newRankItem.subranks = rankItem.subranks
                    .map((subrank) => {
                        const newSubrank = { ...subrank };

                        if (subrank.levels && Array.isArray(subrank.levels)) {
                            let levels = [...subrank.levels];

                            if (id) {
                                levels = levels.filter(
                                    (level) =>
                                        String(level.id).trim() === id.trim(),
                                );
                            }

                            if (search) {
                                const query = decodeURIComponent(search)
                                    .replace(/['"]+/g, "")
                                    .trim()
                                    .toLowerCase();
                                levels = levels.filter((level) => {
                                    const name = String(
                                        level.name || "",
                                    ).toLowerCase();
                                    return name.includes(query);
                                });
                            }

                            if (sortBy) {
                                levels = sortLevels(levels, sortBy);
                            }

                            newSubrank.levels = levels;
                        }

                        return newSubrank;
                    })
                    .filter(
                        (subrank) =>
                            subrank.levels && subrank.levels.length > 0,
                    );
            }

            return newRankItem;
        })
        .filter((rankItem) => {
            if (rankItem.levels && rankItem.levels.length > 0) {
                return true;
            }
            if (rankItem.subranks && rankItem.subranks.length > 0) {
                return true;
            }
            return false;
        });
}

function filterByRankName(data, rank) {
    const targetRank = rank.toLowerCase().trim();

    return data.filter((rankItem) => {
        const itemRank = rankItem.rank ? rankItem.rank.toLowerCase() : "";
        return itemRank === targetRank;
    });
}

function paginateRanks(data, limit, offset) {
    let collected = 0;
    let skipped = 0;
    const result = [];

    for (const rankItem of data) {
        if (collected >= limit) break;

        const newRankItem = { ...rankItem };

        if (rankItem.levels && Array.isArray(rankItem.levels)) {
            const available = rankItem.levels.length;

            if (skipped + available <= offset) {
                skipped += available;
                continue;
            }

            const startIdx = Math.max(0, offset - skipped);
            const takeCount = Math.min(limit - collected, available - startIdx);

            newRankItem.levels = rankItem.levels.slice(
                startIdx,
                startIdx + takeCount,
            );
            collected += newRankItem.levels.length;
            skipped += available;

            if (newRankItem.levels.length > 0) {
                result.push(newRankItem);
            }
        } else if (rankItem.subranks && Array.isArray(rankItem.subranks)) {
            const newSubranks = [];

            for (const subrank of rankItem.subranks) {
                if (collected >= limit) break;

                if (subrank.levels && Array.isArray(subrank.levels)) {
                    const available = subrank.levels.length;

                    if (skipped + available <= offset) {
                        skipped += available;
                        continue;
                    }

                    const startIdx = Math.max(0, offset - skipped);
                    const takeCount = Math.min(
                        limit - collected,
                        available - startIdx,
                    );

                    const newSubrank = {
                        ...subrank,
                        levels: subrank.levels.slice(
                            startIdx,
                            startIdx + takeCount,
                        ),
                    };

                    collected += newSubrank.levels.length;
                    skipped += available;

                    if (newSubrank.levels.length > 0) {
                        newSubranks.push(newSubrank);
                    }
                }
            }

            if (newSubranks.length > 0) {
                newRankItem.subranks = newSubranks;
                result.push(newRankItem);
            }
        }
    }

    return result;
}

function sortLevels(levels, sortBy) {
    const field = sortBy.toLowerCase();

    return [...levels].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];

        if (field === "id") {
            return Number(aVal) - Number(bVal);
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
            return aVal.localeCompare(bVal);
        }

        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
}

function jsonResponse(data) {
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
