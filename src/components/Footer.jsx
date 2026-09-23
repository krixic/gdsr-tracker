import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
    return (
        <footer className="mt-16 bg-[#101010] px-6 py-5 text-sm text-white/70">
            <div className="grid grid-cols-2 items-center gap-3 lg:grid-cols-3">
                <div className="order-2 flex flex-col items-start text-left">
                    <span className="font-semibold text-white">
                        © 2026 gdsr.pages.dev
                    </span>
                    <span className="text-xs">
                        Not affiliated with GDSR, RobTopGamesAB® or other lists
                    </span>
                </div>

                <nav className="order-1 col-span-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm lg:order-2 lg:col-span-1">
                    <Link className="underline" to="/stats">
                        Stats
                    </Link>
                    <span>|</span>
                    <Link className="underline" to="/info">
                        Info
                    </Link>
                    <span>|</span>
                    <Link className="underline" to="/settings">
                        Settings
                    </Link>
                    <span>|</span>
                    <Link className="underline" to="/changelog">
                        Changelog
                    </Link>
                    <span>|</span>
                    <Link className="underline" to="/credits">
                        Credits
                    </Link>
                    <span>|</span>
                    <Link className="underline" to="/api">
                        API Docs
                    </Link>
                </nav>

                <div className="order-3 flex items-center justify-end gap-4">
                    <span>
                        Made by{" "}
                        <a
                            className="underline"
                            href="https://www.youtube.com/@gdcripz"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            gdcripz
                        </a>
                    </span>

                    <a
                        href="https://github.com/krixic/gdsr-tracker"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <FontAwesomeIcon icon={faGithub} className="text-lg" />
                    </a>
                </div>
            </div>
        </footer>
    );
};
