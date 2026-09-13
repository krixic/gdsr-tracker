import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { utilityPages } from "../util.js";
import {
    getListPathLabels,
    listConfigs,
    getListTree,
} from "../data/listConfig.js";
import { ListDropdown } from "./ListDropdown.jsx";
import { usePolledStorage } from "../hooks.js";

export const Header = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const settings = usePolledStorage("settings", {});
    const listTree = getListTree(Boolean(settings.showDemons));
    const isUtility = utilityPages.some((p) => p.path === pathname);
    useEffect(() => {
        if (!isUtility) localStorage.setItem("lastPage", pathname);
    }, [pathname, isUtility]);

    const storedPath = localStorage.getItem("lastPage") || "/";
    const current =
        listConfigs.find((config) => config.path === pathname) ||
        listConfigs.find((config) => config.path === storedPath) ||
        listConfigs[0];
    const currentLabel = getListPathLabels(current).join(" ");

    return (
        <div className="w-full flex justify-center py-2 sm:py-4 bg-bg/50 sticky top-0 z-[100]">
            <div className="max-w-[1200px] w-full flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 px-4 relative">
                <div className="relative flex items-center gap-1">
                    <button
                        type="button"
                        className="h-12 px-3 text-white text-lg sm:text-2xl whitespace-nowrap cursor-pointer hover:text-white/70 transition-colors"
                        onClick={() => navigate(current.path)}
                        title={currentLabel}
                    >
                        {currentLabel}
                    </button>
                    <ListDropdown
                        listTree={listTree}
                        label={currentLabel}
                        activeKey={current.key}
                        activePathLabels={getListPathLabels(current)}
                        onSelect={(config) => navigate(config.path)}
                        showLabel={false}
                        align="left"
                        className="contents [&>button]:min-w-0 [&>button]:bg-transparent [&>button]:px-0 [&>button]:py-2 [&>button]:text-base [&>button]:sm:text-xl [&>button]:gap-0"
                    />
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {utilityPages.map((u) => (
                        <div key={u.path} className="relative group/util">
                            <button
                                className="h-10 sm:h-12 px-3 text-white/70 hover:text-white flex items-center text-md sm:text-xl transition-colors cursor-pointer"
                                onClick={() => navigate(u.path)}
                            >
                                {u.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
