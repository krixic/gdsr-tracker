import React from "react";

export const PageShell = ({ children, sidebar }) => (
    <div className="flex-1 flex w-full max-w-[1200px] mx-auto gap-8 px-4 py-8">
        <div className="flex-1 min-w-0">{children}</div>
        {sidebar}
    </div>
);
