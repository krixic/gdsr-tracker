import React, { useEffect } from "react";
import { infoContent } from "../docs/info.js";
import { InfoSection } from "../components/info/InfoSection.jsx";
import { InfoToc } from "../components/info/InfoToc.jsx";

export const Info = () => {
    useEffect(() => {
        document.title = "GDSR";
    }, []);

    return (
        <div className="flex w-full max-w-[1200px] mx-auto gap-8 px-4 py-8">
            <div className="flex-1 min-w-0">
                {infoContent.map((section) => (
                    <InfoSection key={section.id} section={section} />
                ))}
            </div>
            <InfoToc infoContent={infoContent} />
        </div>
    );
};
