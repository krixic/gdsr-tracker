import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { utilityPages } from "../util.js";
import { listPages } from "../data/listConfig.js";

const Menu = ({ items, labelKey, onNavigate, close }) => (
    <div className="absolute top-full left-0 z-50 min-w-full w-max bg-bg shadow-lg text-center">
        {items.map((p) => (
            <div
                key={p.path}
                onClick={() => {
                    onNavigate(p.path);
                    close();
                }}
                className="py-2 cursor-pointer text-white hover:bg-level/80"
            >
                {p[labelKey]}
            </div>
        ))}
    </div>
);

const Underline = ({ activeGroup }) => (
    <div
        className={`absolute bottom-0 left-2 right-2 h-[2px] bg-input opacity-0 ${activeGroup} transition-opacity duration-150 z-20`}
    />
);

export const Header = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [openMenu, setOpenMenu] = useState(null);

    const isUtility = utilityPages.some((p) => p.path === pathname);
    useEffect(() => {
        if (!isUtility) localStorage.setItem("lastPage", pathname);
    }, [pathname, isUtility]);

    const storedPath = localStorage.getItem("lastPage") || "/";
    const current =
        listPages.find((p) => p.path === pathname) ||
        listPages.find((p) => p.path === storedPath) ||
        listPages[0];

    const mainPages = [
        ...new Map(listPages.map((p) => [p.main, p])).values(),
    ].filter((p) => p.main !== current.main);
    const subPages = listPages.filter(
        (p) => p.main === current.main && p.path !== current.path,
    );

    const buttonBase =
        "h-12 px-3 sm:px-4 py-2 text-white flex items-center justify-center text-lg sm:text-2xl whitespace-nowrap relative z-10 cursor-pointer transition-all";

    return (
        <div className="w-full flex justify-center py-2 sm:py-4 bg-bg/50 sticky top-0 z-[100]">
            <div className="max-w-[1200px] w-full flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 px-4 relative">
                <div
                    className="relative flex items-center group/nav"
                    onMouseLeave={() => setOpenMenu(null)}
                >
                    <div className="relative group/main">
                        <button
                            className={buttonBase}
                            onClick={() => navigate(current.path)}
                            onMouseEnter={() =>
                                !isUtility && setOpenMenu("main")
                            }
                        >
                            {current.main}
                        </button>
                        {!isUtility && (
                            <Underline activeGroup="group-hover/main:opacity-100" />
                        )}

                        {openMenu === "main" && (
                            <Menu
                                items={mainPages}
                                labelKey="main"
                                onNavigate={navigate}
                                close={() => setOpenMenu(null)}
                            />
                        )}
                    </div>

                    {current.sub && (
                        <div className="relative sm:-ml-4 group/sub">
                            <button
                                className={buttonBase}
                                onClick={() => navigate(current.path)}
                                onMouseEnter={() => {
                                    setOpenMenu(null);
                                    if (!isUtility && subPages.length > 0)
                                        setOpenMenu("sub");
                                }}
                            >
                                <span className="mx-1 opacity-50">/</span>
                                {current.sub}
                            </button>
                            {!isUtility && (
                                <Underline activeGroup="group-hover/sub:opacity-100" />
                            )}

                            {openMenu === "sub" && (
                                <Menu
                                    items={subPages}
                                    labelKey="sub"
                                    onNavigate={navigate}
                                    close={() => setOpenMenu(null)}
                                />
                            )}
                        </div>
                    )}
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
                            <Underline activeGroup="group-hover/util:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
