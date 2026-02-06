export const settingsConfig = [
    {
        id: "display",
        title: "Display",
        settings: [
            {
                id: "showAttempts",
                name: "Show Attempts",
                description:
                    "Show an input field to track the attempts for each level",
                type: "toggle",
                default: false,
            },
        ],
    },
    {
        id: "data",
        title: "Data",
        settings: [
            {
                id: "exportData",
                name: "Copy Progress Data",
                description:
                    "Copy your progress and attempts data to clipboard as JSON text",
                type: "button",
                action: "copy",
            },
            {
                id: "importData",
                name: "Paste Progress Data",
                description: "Paste JSON text to restore your progress",
                type: "button",
                action: "paste",
            },
            {
                id: "clearData",
                name: "Clear All Data",
                description: "Remove all data. This action cannot be undone",
                type: "button",
                action: "clear",
                dangerous: true,
            },
        ],
    },
];
