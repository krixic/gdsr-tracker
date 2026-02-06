import React from "react";

export const InfoToc = ({ infoContent }) => {
    return (
        <aside className="w-64 hidden lg:block">
            <div className="bg-level p-6 sticky top-8">
                <h3 className="font-bold mb-4 text-sm tracking-wide">
                    Table of Contents
                </h3>
                <nav>
                    <ul className="space-y-1">
                        {infoContent.map((section) => (
                            <li key={section.id}>
                                <a
                                    href={`#${section.id}`}
                                    className="block text-sm text-white/70 hover:text-white transition-colors py-1 duration-200 font-medium"
                                >
                                    {section.title}
                                </a>
                                {section.sections && (
                                    <ul className="ml-3 mt-1 space-y-1 border-l-2 border-white/10 pl-3">
                                        {section.sections.map((subsection) => (
                                            <li key={subsection.id}>
                                                <a
                                                    href={`#${subsection.id}`}
                                                    className="block text-xs text-white/60 transition-colors py-1"
                                                >
                                                    {subsection.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};
