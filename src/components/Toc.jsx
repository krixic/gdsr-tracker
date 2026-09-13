import React from "react";

export const Toc = ({
    items,
    getId = (item) => item.id,
    renderLabel = (item) => item.title,
    labelClassName,
    getChildren,
    getChildId = (child) => child.id,
    renderChildLabel = (child) => child.title,
    childListClassName,
    childLabelClassName,
}) => (
    <aside className="w-64 hidden lg:block">
        <div className="bg-level p-6 sticky top-8">
            <h3 className="font-bold mb-4 text-sm tracking-wide">
                Table of Contents
            </h3>
            <nav>
                <ul className="space-y-1">
                    {items.map((item) => {
                        const children = getChildren?.(item);
                        return (
                            <li key={getId(item)}>
                                <a
                                    href={`#${getId(item)}`}
                                    className={labelClassName}
                                >
                                    {renderLabel(item)}
                                </a>
                                {children && (
                                    <ul className={childListClassName}>
                                        {children.map((child) => (
                                            <li key={getChildId(child)}>
                                                <a
                                                    href={`#${getChildId(child)}`}
                                                    className={
                                                        childLabelClassName
                                                    }
                                                >
                                                    {renderChildLabel(child)}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    </aside>
);
