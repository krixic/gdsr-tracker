import React, { useEffect } from "react";
import { Levels } from "../components/Levels.jsx";

export const ListPage = ({ config }) => {
    useEffect(() => {
        document.title = config.title;
    }, [config.title]);

    return (
        <div className="flex-1">
            <Levels levels={config.levels} type={config.type} />
        </div>
    );
};
