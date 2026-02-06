import React from "react";

export const StatsHeader = ({
    activeMain,
    activeSub,
    listOptions,
    selectedMain,
    selectedSub,
    setSelectedMain,
    setSelectedSub,
    openMainMenu,
    setOpenMainMenu,
    openSubMenu,
    setOpenSubMenu,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold mb-1">Stats</h2>
                <p className="text-sm text-white/70">
                    Track completion progress across each list and rank
                </p>
            </div>
            <div className="flex items-center gap-2">
                <div
                    className="relative"
                    onMouseLeave={() => setOpenMainMenu(false)}
                >
                    <button
                        className="bg-input px-4 py-2 text-white text-sm sm:text-base min-w-[120px] text-left cursor-pointer"
                        onClick={() => setOpenMainMenu((prev) => !prev)}
                    >
                        {activeMain.label}
                    </button>
                    {openMainMenu && (
                        <div className="absolute top-full left-0 z-50 min-w-full w-max bg-bg shadow-lg text-center">
                            {Object.entries(listOptions)
                                .filter(([key]) => key !== selectedMain)
                                .map(([key, option]) => (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            setSelectedMain(key);
                                            const nextSubs = Object.keys(
                                                option.subs,
                                            );
                                            if (
                                                !nextSubs.includes(selectedSub)
                                            ) {
                                                setSelectedSub(nextSubs[0]);
                                            }
                                            setOpenMainMenu(false);
                                        }}
                                        className="py-2 cursor-pointer text-white hover:bg-level/80 px-4 text-left"
                                    >
                                        {option.label}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                <div
                    className="relative"
                    onMouseLeave={() => setOpenSubMenu(false)}
                >
                    <button
                        className="bg-input px-4 py-2 text-white text-sm sm:text-base min-w-[120px] text-left cursor-pointer"
                        onClick={() => setOpenSubMenu((prev) => !prev)}
                    >
                        {activeSub.label}
                    </button>
                    {openSubMenu && (
                        <div className="absolute top-full left-0 z-50 min-w-full w-max bg-bg shadow-lg text-center">
                            {Object.entries(activeMain.subs)
                                .filter(([key]) => key !== selectedSub)
                                .map(([key, option]) => (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            setSelectedSub(key);
                                            setOpenSubMenu(false);
                                        }}
                                        className="py-2 cursor-pointer text-white hover:bg-level/80 px-4 text-left"
                                    >
                                        {option.label}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
