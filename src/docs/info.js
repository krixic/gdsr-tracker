export const infoContent = [
    {
        id: "about",
        title: "Information",
        content: `Geometry Dash Skill Rating (GDSR) is a comprehensive system of tiered lists for tracking and organising challenges in Geometry Dash. This site helps players monitor their progress across multiple difficulty tiers and level categories to further improve their skill.`,
    },
    {
        id: "how-to-use",
        title: "How to Use",
        sections: [
            {
                id: "tracking-progress",
                title: "Tracking Progress",
                description: "How to mark progress on levels",
                content: `**Level Marking:**
Clicking a level will cycle through "Incomplete", "In Progress", and "Complete"
Right-click any level to instantly mark it as completed

**Progress Input:**
Click the percentage input field on the right
Enter a value between 1-99 to track partial progress
Level will mark as "In Progress" if the value is between 1-99

**Attempts Tracking:** 
If enabled, shows an additional input field next to progress
Use the additional input field to track attempt count
Enter any number to record your attempts
Set to 0 to clear`,
            },
            {
                id: "bulk-actions",
                title: "Bulk Actions",
                description: "Editing multiple levels at once",
                content: `**Bulk Actions:**
Right-click any rank header to complete all uncompleted levels in that rank
If all levels are complete, they will all be unmarked
If any levels are incomplete, all will be marked as complete`,
            },
            {
                id: "level-actions",
                title: "Level Actions",
                description: "Copying IDs and opening videos",
                content: `**Copy Icon:**
Click the copy icon on any level to copy the level ID to your clipboard

**YouTube Icon:**
Click the YouTube icon to open the level's video in a new tab
Icon is not shown if no video is available`,
            },
        ],
    },
    {
        id: "rank-system",
        title: "Rank System",
        sections: [
            {
                id: "rank-requirements",
                title: "Rank Requirements",
                description: "How rank progression and completion works",
                content: `Each rank has a minimum completion requirement before you earn that rank. The rank header shows your progress in the format:

**Format:** Rank (Completed/Requirement)

**Example:** Gold (5/7)
You've completed 5 levels
You need 7 completions to earn the Gold rank

**Rank Tiers:**
**Rank**: Complete the minimum requirement to earn the rank
**Rank+**: Complete all levels in the rank to earn the plus tier

**Example Progression:**
Gold (5/7) - Gold rank is not achieved
Gold (7/11) - Gold rank achieved, requirement changes to Gold+
Gold (11/11) - Gold+ rank achieved (all levels complete)

**Rank Visuals:**
No border: Rank is not achieved
Coloured border: Minimum requirement met (Rank achieved)
Black/White border: All levels in rank completed (Rank+)
Small grey italic rank text: Rank is excluded from grand total counts

**Note:** Tiers and requirements vary by list`,
            },
        ],
    },
    {
        id: "features",
        title: "Features",
        sections: [
            {
                id: "data-persistence",
                title: "Data Persistence",
                description: "Progress saving",
                content: `**Automatic Saving:**
All progress is saved to local storage
Changes save instantly when changes are made to level progress

**Data Persistence:**
Data persists until you clear your browser data
Local, only specific to browser and device

**Backup & Restore:**
Use Settings to Copy progress data to backup
Copy the JSON text
Use Settings to Paste Progress Data to restore`,
            },
            {
                id: "customisation",
                title: "Customisation",
                description: "Personalising the tracker",
                content: `**Settings Page:**
Access via the Settings menu
Configure display preferences
Manage your data

**Available Options:**
Show/hide attempts column
Show/hide Demon levels (for now...)
Copy/paste progress data
Clear all progress data`,
            },
        ],
    },
];
