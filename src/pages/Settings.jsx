import React, { useEffect, useState } from "react";
import { settingsConfig } from "../config/settingsConfig.js";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

const TOAST_LIMIT = 3;

const loadSettings = () => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : { showAttempts: false };
};

const saveSettings = (settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
};

export const Settings = () => {
    const [settings, setSettings] = useState(loadSettings);
    const [showPasteModal, setShowPasteModal] = useState(false);
    const [pasteText, setPasteText] = useState("");

    useEffect(() => {
        document.title = "GDSR";
    }, []);

    useEffect(() => {
        saveSettings(settings);
    }, [settings]);

    const toggleSetting = (id) => {
        setSettings((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleCopy = async () => {
        const progress = localStorage.getItem("progress") || "{}";
        const attempts = localStorage.getItem("attempts") || "{}";
        const exportData = {
            progress: JSON.parse(progress),
            attempts: JSON.parse(attempts),
            exportedAt: new Date().toISOString(),
        };

        const jsonText = JSON.stringify(exportData);

        try {
            await navigator.clipboard.writeText(jsonText);
            toast.success("Copied data to clipboard!");
        } catch (error) {
            const textarea = document.createElement("textarea");
            textarea.value = jsonText;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            toast.success("Copied data to clipboard!");
            console.log(error);
        }
    };

    const handlePaste = () => {
        setShowPasteModal(true);
        setPasteText("");
    };

    const handlePasteConfirm = () => {
        try {
            const data = JSON.parse(pasteText);
            if (data.progress) {
                localStorage.setItem("progress", JSON.stringify(data.progress));
            }
            if (data.attempts) {
                localStorage.setItem("attempts", JSON.stringify(data.attempts));
            }
            setShowPasteModal(false);
            setPasteText("");
            toast.success("Data imported successfully");
        } catch (error) {
            toast.error("Failed to import data: Invalid JSON");
            console.log(error);
        }
    };

    const handleClear = () => {
        if (
            confirm(
                "Are you sure you want to clear all progress data? This cannot be undone.",
            )
        ) {
            localStorage.removeItem("progress");
            localStorage.removeItem("attempts");
            toast.success("All data cleared");
        }
    };

    const handleAction = (action) => {
        switch (action) {
            case "copy":
                handleCopy();
                break;
            case "paste":
                handlePaste();
                break;
            case "clear":
                handleClear();
                break;
            default:
                break;
        }
    };

    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= TOAST_LIMIT)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);

    return (
        <>
            <Toaster
                containerClassName="copytoastcontainer"
                toastOptions={{
                    duration: 2000,
                    style: {
                        borderRadius: 0,
                        padding: "0 16px",
                        color: "white",
                        height: "50px",
                        fontFamily: "Readex Pro",
                        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
                        userSelect: "none",
                        display: "inline-flex",
                        maxWidth: "90vw",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    },
                    success: {
                        style: {
                            background: "rgb(0, 180, 0)",
                        },
                    },
                    error: {
                        style: {
                            background: "rgb(180, 0, 0)",
                        },
                    },
                }}
            />
            <div className="flex w-full max-w-[1200px] mx-auto gap-8 px-4 py-8">
                <div className="flex-1 min-w-0">
                    <div className="bg-level p-8 mb-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                Settings
                            </h1>
                            <p className="text-sm opacity-70">
                                Configure my settings
                            </p>
                        </div>

                        {settingsConfig.map((section) => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="mb-12 last:mb-0"
                            >
                                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-white/10">
                                    {section.title}
                                </h2>

                                <div className="space-y-6">
                                    {section.settings.map((setting) => (
                                        <div
                                            key={setting.id}
                                            className="flex items-start justify-between gap-6 p-4 bg-black/20 border border-white/5"
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white/90 mb-1">
                                                    {setting.name}
                                                </h3>
                                                <p className="text-sm text-white/70">
                                                    {setting.description}
                                                </p>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {setting.type === "toggle" && (
                                                    <button
                                                        onClick={() =>
                                                            toggleSetting(
                                                                setting.id,
                                                            )
                                                        }
                                                        className={`
            relative inline-flex h-6 w-11 items-center
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-white/20
            rounded-none 
            ${settings[setting.id] ? "bg-green-600" : "bg-white/20"}
        `}
                                                    >
                                                        <span
                                                            className={`
                inline-block h-4 w-4 bg-white
                transition-transform duration-200 ease-in-out
                rounded-none 
                ${settings[setting.id] ? "translate-x-6" : "translate-x-1"}
            `}
                                                        />
                                                    </button>
                                                )}

                                                {setting.type === "button" && (
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                setting.action,
                                                            )
                                                        }
                                                        className={`
                                                        px-4 py-2 font-semibold text-sm
                                                        transition-colors duration-200
                                                        ${
                                                            setting.dangerous
                                                                ? "bg-red-700 hover:bg-red-700 text-white"
                                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                                        }
                                                    `}
                                                    >
                                                        {setting.name}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="w-64 hidden lg:block">
                    <div className="bg-level p-6 sticky top-8">
                        <h3 className="font-bold mb-4 text-sm tracking-wide text-white/80">
                            Table of Contents
                        </h3>
                        <nav>
                            <ul className="space-y-1">
                                {settingsConfig.map((section) => (
                                    <li key={section.id}>
                                        <a
                                            href={`#${section.id}`}
                                            className="block text-sm text-white/70 hover:text-white transition-colors py-1 transform duration-200"
                                        >
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                {showPasteModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-level p-6 max-w-2xl w-full border border-white/10">
                            <h3 className="text-xl font-bold mb-4">
                                Paste Progress Data
                            </h3>
                            <p className="text-sm text-white/70 mb-4">
                                Paste my JSON data
                            </p>
                            <textarea
                                className="w-full h-64 bg-black/40 text-white p-4 border border-white/10 font-mono text-sm focus:outline-none focus:border-white/30"
                                placeholder='{"progress": {...}, "attempts": {...}}'
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                            />
                            <div className="flex gap-3 mt-4 justify-end">
                                <button
                                    onClick={() => {
                                        setShowPasteModal(false);
                                        setPasteText("");
                                    }}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePasteConfirm}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Import Data
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
