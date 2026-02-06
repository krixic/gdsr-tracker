import React from "react";
import { ApiField } from "./ApiField.jsx";

export const ApiObjectSection = ({ subsection, tokens }) => {
    return (
        <div id={subsection.id} className="scroll-mt-8">
            <h3 className="text-xl font-semibold mb-3 text-white/90">
                {subsection.title}
            </h3>
            <p className="text-sm text-white/70 mb-4">
                {subsection.description}
            </p>
            <div className="mb-4">
                <h4 className="text-sm font-bold text-white/90 mb-3 uppercase tracking-wide">
                    Fields
                </h4>
                <div className="space-y-2">
                    {subsection.fields.map((field) => (
                        <ApiField
                            key={field.name}
                            field={field}
                            tokens={tokens}
                        />
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-sm font-bold text-white/90 mb-2 uppercase tracking-wide">
                    Example
                </h4>
                <pre className="bg-black/60 p-4 border border-white/10 overflow-x-auto">
                    <code className="text-sm text-white/90">
                        {JSON.stringify(subsection.example, null, 2)}
                    </code>
                </pre>
            </div>
        </div>
    );
};
