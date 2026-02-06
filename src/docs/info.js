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
                description: "How to mark your progress on levels",
                content: `**Clicking a Level:**
- First click: Marks as in progress
- Second click: Marks as completed
- Third click: Resets progress

**Right-Click:**
- Right-click any level to instantly mark it as completed

**Progress Input:**
- Click the percentage input field on the right
- Enter a value between 1-99 to track partial progress
- Press Enter or click away to save

**Attempts Tracking:** 
- If enabled, shows an additional input field next to progress
- Use the additional input field to track attempt count
- Enter any number to record your attempts
- Set to 0 or empty to clear`,
            },
            {
                id: "bulk-mode",
                title: "Bulk Editing Mode",
                description: "Mark multiple levels at once",
                content: `**Activating Bulk Mode:**
- Click the pencil button in the bottom-right corner
- Rank headers will display a green tint when active

**Bulk Actions:**
- Right-click any rank header to toggle all levels in that rank
- If all levels are complete, they will all be unmarked
- If any levels are incomplete, all will be marked as complete`,
            },
            {
                id: "level-actions",
                title: "Level Actions",
                description: "Copy IDs and watch level videos",
                content: `**Copy Icon:**
- Click the copy icon on any level
- The level ID will be copied to your clipboard
- A success toast will appear confirming the copy

**YouTube Icon:**
- Click the YouTube icon to open the level's video
- Videos open in a new tab
- Icon is not shown if no video is available`,
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

**Format:** Rank Name (Completed/Requirement)

**Example:** Gold (5/7)
- You've completed 5 levels
- You need 7 completions to earn the Gold rank

**Rank Tiers:**
- **Rank Name**: Complete the minimum requirement to earn the rank
- **Rank Name+**: Complete all levels in the rank to earn the plus tier

**Example Progression:**
- Gold (5/7) - Still working toward Gold rank
- Gold (7/11) - Gold rank earned, working toward Gold+
- Gold (11/11) - Gold+ rank earned (all levels complete)

**Visual Indicators:**
- No border: Still working toward the rank
- Coloured border: Minimum requirement met (Rank earned)
- Black/White border: All levels in rank completed (Rank+)

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
                description: "Your progress is automatically saved",
                content: `**Automatic Saving:**
- All progress is saved to local storage
- Changes save instantly when changes are made to level progress

**Data Persistence:**
- Data persists until you clear your browser data
- Only specific to your browser and device

**Backup & Restore:**
- Use Settings to Copy progress data to backup
- Copy the JSON text
- Use Settings to Paste Progress Data to restore`,
            },
            {
                id: "customisation",
                title: "Customisation",
                description: "Personalise your tracking experience",
                content: `**Settings Page:**
- Access via the Settings menu
- Configure display preferences
- Manage your data

**Available Options:**
- Show/hide attempts column
- Copy/paste progress data
- Clear all progress data

**Visual Feedback:**
- Coloured backgrounds for progress states
- Border indicators for rank completion
- Toast notifications for actions`,
            },
        ],
    },
];
