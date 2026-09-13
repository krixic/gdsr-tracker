import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
    return (
        <footer className="mt-16 bg-[#101010] px-6 py-5 text-center text-sm text-white/70">
            <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
                <div className="flex flex-col sm:items-start">
                    <span className="font-semibold text-white">
                        © 2026 gdsr.pages.dev
                    </span>
                    <span className="text-xs">
                        Not affiliated with GDSR, RobTopGamesAB® or other lists
                    </span>
                </div>

                <nav className="flex items-center justify-center gap-3">
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

                <div className="flex items-center justify-center gap-4 sm:justify-end">
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
