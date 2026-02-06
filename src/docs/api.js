export const apiDocs = [
    {
        id: "introduction",
        title: "Introduction",
        content: `This is the documentation for the GDSR API. The API can be used to retrieve data about levels across multiple challenge skill rating lists on Geometry Dash.

All endpoints described here are located under \`/api/\` followed by the list name ({listsInline}).

The API returns JSON formatted data. It is always good practice to set the \`Accept\` header in requests to \`application/json\`.`,
    },
    {
        id: "objects",
        title: "Objects",
        sections: [
            {
                id: "rank-object",
                title: "Rank Object",
                description:
                    "A rank object represents a difficulty tier containing multiple levels.",
                fields: [
                    {
                        name: "rank",
                        type: "string",
                        description:
                            "The name of the rank (e.g., 'Bronze', 'Silver', 'Gold')",
                    },
                    {
                        name: "levels",
                        type: "Level[]",
                        description:
                            "Array of level objects belonging to this rank",
                        optional: true,
                    },
                    {
                        name: "subranks",
                        type: "Subrank[]",
                        description:
                            "Array of subrank objects (only present in nested structures like Bonus tier)",
                        optional: true,
                    },
                ],
                example: {
                    rank: "Gold",
                    levels: [
                        {
                            name: "Magic Touch",
                            id: 62413539,
                            video: "https://www.youtube.com/watch?v=...",
                        },
                    ],
                },
            },
            {
                id: "subrank-object",
                title: "Subrank Object",
                description:
                    "A subrank object represents a nested difficulty tier within a main rank.",
                fields: [
                    {
                        name: "rank",
                        type: "string",
                        description:
                            "The name of the subrank (e.g., 'Bronze', 'Silver')",
                    },
                    {
                        name: "levels",
                        type: "Level[]",
                        description:
                            "Array of level objects belonging to this subrank",
                    },
                ],
                example: {
                    rank: "Bronze",
                    levels: [
                        {
                            name: "A B C D E",
                            id: 47096541,
                            video: "https://www.youtube.com/watch?v=...",
                        },
                    ],
                },
            },
            {
                id: "level-object",
                title: "Level Object",
                description:
                    "A level object represents a single Geometry Dash level.",
                fields: [
                    {
                        name: "name",
                        type: "string",
                        description: "The name of the level",
                    },
                    {
                        name: "id",
                        type: "integer",
                        description: "The unique Geometry Dash level ID",
                    },
                    {
                        name: "video",
                        type: "string",
                        description: "URL to the verification/showcase video",
                    },
                ],
                example: {
                    name: "Corrosive Flower",
                    id: 59843187,
                    video: "https://www.youtube.com/watch?v=Z7XwQ8gjU4U",
                },
            },
        ],
    },
    {
        id: "pagination",
        title: "Pagination",
        content: `Some endpoints in the API support pagination via query parameters. This allows you to retrieve large datasets in manageable chunks.

**Pagination Parameters:**

- \`limit\` - The maximum number of levels to return (across all ranks)
- \`offset\` - The number of levels to skip before starting to return results

**Response Fields:**

- \`count\` - Number of levels returned in this response
- \`total\` - Total number of levels in the entire dataset
- \`found\` - Total number of levels matching the current filters

Pagination operates across the nested structure, so requesting \`limit=10\` will return up to 10 levels total, which may span multiple ranks.

**Note:** There is no way to get the total amount of pages, as both page bounds and size can be chosen arbitrarily.`,
    },
    {
        id: "filtering",
        title: "Filtering",
        content: `Endpoints that return lists of objects support filtering via query parameters. When filters are applied, the response maintains the nested rank structure but only includes ranks and levels that match the filter criteria.

**Available Filters:**

- \`id\` - Filter by exact level ID
- \`rank\` - Filter by rank name (case-insensitive)
- \`search\` - Filter by level name (case-insensitive, partial match)
- \`sortBy\` - Sort levels within ranks by field name (e.g., 'name', 'id')

**Filtering Behavior:**

When filtering is applied, empty ranks are automatically removed from the response. For example, searching for "wave" will only return ranks that contain levels with "wave" in their name.

Multiple filters can be combined in a single request.`,
    },
    {
        id: "errors",
        title: "List of Errors",
        content: `In case of a client or server error, the API returns an error response. Following is a list of errors that can occur:`,
        errors: [
            {
                code: 404,
                name: "NOT FOUND",
                description:
                    "The requested list does not exist. Available lists are: {listsPlain}",
            },
            {
                code: 200,
                name: "OK (Empty Result)",
                description:
                    "The request was successful but no results matched the filters. Check the 'found' field to confirm.",
            },
        ],
    },
    {
        id: "endpoints",
        title: "Endpoints",
        sections: [
            {
                id: "get-list",
                title: "Retrieve list data",
                method: "GET",
                path: "/api/{list}",
                description:
                    "Retrieves all levels from the specified list, organised by rank.",
                pagination: true,
                params: [
                    {
                        name: "list",
                        location: "path",
                        type: "string",
                        required: true,
                        description:
                            "The list identifier ({listsInline})",
                    },
                ],
                queryParams: [
                    {
                        name: "limit",
                        type: "integer",
                        required: false,
                        description:
                            "Maximum number of levels to return (default: all)",
                    },
                    {
                        name: "offset",
                        type: "integer",
                        required: false,
                        description: "Number of levels to skip (default: 0)",
                    },
                    {
                        name: "sortBy",
                        type: "string",
                        required: false,
                        description:
                            "Field to sort levels by (default: natural order)",
                    },
                ],
                request: `GET /api/gdsr
Accept: application/json`,
                response: {
                    code: 200,
                    body: {
                        list: "gdsr",
                        count: 150,
                        total: 150,
                        found: 150,
                        data: [
                            {
                                rank: "Bronze",
                                levels: [
                                    {
                                        name: "Corrosive Flower",
                                        id: 59843187,
                                        video: "https://www.youtube.com/watch?v=...",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                id: "get-ranks",
                title: "List available ranks",
                method: "GET",
                path: "/api/{list}",
                description:
                    "Returns an array of all unique rank names in the specified list.",
                pagination: false,
                params: [
                    {
                        name: "list",
                        location: "path",
                        type: "string",
                        required: true,
                        description:
                            "The list identifier ({listsInline})",
                    },
                ],
                queryParams: [
                    {
                        name: "ranks",
                        type: "boolean",
                        required: true,
                        description: "Must be set to 'true' to retrieve ranks",
                    },
                ],
                request: `GET /api/gdsr?ranks=true
Accept: application/json`,
                response: {
                    code: 200,
                    body: {
                        list: "gdsr",
                        ranks: [
                            "Bronze",
                            "Silver",
                            "Gold",
                            "Emerald",
                            "Ruby",
                            "Diamond",
                            "Amethyst",
                            "Legend",
                        ],
                        subranks: {
                            Bonus: ["Bronze", "Silver"],
                        },
                    },
                },
            },
            {
                id: "filter-by-id",
                title: "Filter by level ID",
                method: "GET",
                path: "/api/{list}",
                description:
                    "Find a specific level by its unique ID. Returns the rank structure containing only the matching level.",
                pagination: false,
                params: [
                    {
                        name: "list",
                        location: "path",
                        type: "string",
                        required: true,
                        description: "The list identifier",
                    },
                ],
                queryParams: [
                    {
                        name: "id",
                        type: "integer",
                        required: true,
                        description: "The level ID to search for",
                    },
                ],
                request: `GET /api/gdsr?id=59843187
Accept: application/json`,
                response: {
                    code: 200,
                    body: {
                        list: "gdsr",
                        count: 1,
                        total: 150,
                        found: 1,
                        data: [
                            {
                                rank: "Bronze",
                                levels: [
                                    {
                                        name: "Corrosive Flower",
                                        id: 59843187,
                                        video: "https://www.youtube.com/watch?v=...",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                id: "filter-by-rank",
                title: "Filter by rank",
                method: "GET",
                path: "/api/{list}",
                description:
                    "Show only the specified rank with all its levels. Case-insensitive matching.",
                pagination: true,
                params: [
                    {
                        name: "list",
                        location: "path",
                        type: "string",
                        required: true,
                        description: "The list identifier",
                    },
                ],
                queryParams: [
                    {
                        name: "rank",
                        type: "string",
                        required: true,
                        description:
                            "The rank name to filter by (case-insensitive)",
                    },
                ],
                request: `GET /api/gdsr?rank=gold
Accept: application/json`,
                response: {
                    code: 200,
                    body: {
                        list: "gdsr",
                        count: 11,
                        total: 150,
                        found: 11,
                        data: [
                            {
                                rank: "Gold",
                                levels: [
                                    {
                                        name: "Magic Touch",
                                        id: 62413539,
                                        video: "https://www.youtube.com/watch?v=...",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            {
                id: "search-levels",
                title: "Search by level name",
                method: "GET",
                path: "/api/{list}",
                description:
                    "Search for levels containing a specific string in their name. Returns ranks containing matching levels only.",
                pagination: true,
                params: [
                    {
                        name: "list",
                        location: "path",
                        type: "string",
                        required: true,
                        description: "The list identifier",
                    },
                ],
                queryParams: [
                    {
                        name: "search",
                        type: "string",
                        required: true,
                        description:
                            "Search term (case-insensitive, partial match)",
                    },
                ],
                request: `GET /api/gdsr?search=wave
Accept: application/json`,
                response: {
                    code: 200,
                    body: {
                        list: "gdsr",
                        count: 5,
                        total: 150,
                        found: 5,
                        data: [
                            {
                                rank: "Silver",
                                levels: [
                                    {
                                        name: "Aftermath v2 wave",
                                        id: 59297291,
                                        video: "https://www.youtube.com/watch?v=...",
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        ],
    },
];
