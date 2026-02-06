import React from "react";
import { ApiParameter } from "./ApiParameter.jsx";
import { applyListTokens, renderInlineTokens } from "./apiUtils.jsx";

export const ApiEndpoint = ({ section, tokens }) => {
    return (
        <div id={section.id} className="mb-12 scroll-mt-8">
            <div className="flex items-baseline gap-3 mb-4">
                <span className="text-sm font-bold px-2 py-1 bg-blue-600 text-white">
                    {section.method}
                </span>
                <code className="text-lg font-mono">{section.path}</code>
            </div>

            {section.pagination && (
                <div className="bg-blue-950/30 border border-blue-500/30 p-3 mb-4 text-sm">
                    <strong className="text-blue-400">Pagination:</strong>{" "}
                    <span className="text-white/80">
                        This endpoint supports pagination via query parameters.
                        Please see the{" "}
                        <a
                            href="#pagination"
                            className="text-blue-400 hover:underline"
                        >
                            documentation on pagination
                        </a>{" "}
                        for information on the additional request and response
                        fields.
                    </span>
                </div>
            )}

            <p className="text-white/80 mb-6">
                {renderInlineTokens(
                    applyListTokens(section.description, tokens),
                )}
            </p>

            {section.params && section.params.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-white/90 mb-3 uppercase tracking-wide">
                        Path Parameters
                    </h4>
                    <div className="space-y-2">
                        {section.params.map((param) => (
                            <ApiParameter
                                key={param.name}
                                param={param}
                                tokens={tokens}
                            />
                        ))}
                    </div>
                </div>
            )}

            {section.queryParams && section.queryParams.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-white/90 mb-3 uppercase tracking-wide">
                        Query Parameters
                    </h4>
                    <div className="space-y-2">
                        {section.queryParams.map((param) => (
                            <ApiParameter
                                key={param.name}
                                param={param}
                                tokens={tokens}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                    <h4 className="text-sm font-bold text-white/90 mb-2 uppercase tracking-wide">
                        Request
                    </h4>
                    <pre className="bg-black/60 p-4 border border-white/10 overflow-x-auto">
                        <code className="text-sm text-green-400">
                            {section.request}
                        </code>
                    </pre>
                </div>

                <div className="lg:col-span-3">
                    <h4 className="text-sm font-bold text-white/90 mb-2 uppercase tracking-wide">
                        Response ({section.response.code})
                    </h4>
                    <pre className="bg-black/60 p-4 border border-white/10 overflow-x-auto">
                        <code className="text-sm text-white/90">
                            {JSON.stringify(section.response.body, null, 2)}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
};
