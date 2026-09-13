import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const getInitialExpanded = (pathLabels) => {
    return pathLabels.slice(0, -1).reduce((expanded, _, idx) => {
        expanded.add(pathLabels.slice(0, idx + 1).join("/"));
        return expanded;
    }, new Set());
};

const ListTreeNode = ({
    node,
    activeKey,
    expanded,
    setExpanded,
    onSelect,
    closeMenu,
    depth = 0,
}) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isActive = node.config?.key === activeKey;
    const paddingLeft = `${12 + depth * 18}px`;

    const selectNode = () => {
        if (node.config) {
            onSelect(node.config);
            closeMenu();
        }
    };

    const toggleExpanded = () => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(node.id)) {
                next.delete(node.id);
            } else {
                next.add(node.id);
            }
            return next;
        });
    };

    if (!hasChildren) {
        return (
            <button
                type="button"
                onClick={selectNode}
                className={`w-full py-2 pr-4 text-left text-sm cursor-pointer hover:bg-input/80 flex items-center gap-2 ${
                    isActive ? "bg-input text-white" : "text-white/80"
                }`}
                aria-current={isActive ? "page" : undefined}
                style={{ paddingLeft }}
            >
                <span className="flex-1">{node.label}</span>
            </button>
        );
    }

    if (!node.config) {
        return (
            <div>
                <div
                    role="button"
                    tabIndex={0}
                    onClick={toggleExpanded}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            toggleExpanded();
                        }
                    }}
                    className="w-full py-2 pr-4 text-left text-sm text-white/50 cursor-pointer hover:bg-input/80 flex items-center justify-between gap-2"
                    style={{ paddingLeft }}
                >
                    <span>{node.label}</span>
                    <FontAwesomeIcon
                        icon={isExpanded ? faChevronDown : faChevronRight}
                        className="w-3"
                    />
                </div>
                {isExpanded && (
                    <div>
                        {node.children.map((child) => (
                            <ListTreeNode
                                key={child.id}
                                node={child}
                                activeKey={activeKey}
                                expanded={expanded}
                                setExpanded={setExpanded}
                                onSelect={onSelect}
                                closeMenu={closeMenu}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div
                className={`flex items-center text-sm text-white hover:bg-input/80 ${
                    isActive ? "bg-input" : ""
                }`}
                style={{ paddingLeft }}
            >
                <button
                    type="button"
                    onClick={selectNode}
                    className="flex-1 py-2 text-left cursor-pointer text-white"
                    aria-current={isActive ? "page" : undefined}
                >
                    {node.label}
                </button>

                <button
                    type="button"
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.label}`}
                    onClick={toggleExpanded}
                    className="py-2 px-4 cursor-pointer text-white/60 hover:text-white"
                >
                    <FontAwesomeIcon
                        icon={isExpanded ? faChevronDown : faChevronRight}
                        className="w-3"
                    />
                </button>
            </div>
            {isExpanded && (
                <div>
                    {node.children.map((child) => (
                        <ListTreeNode
                            key={child.id}
                            node={child}
                            activeKey={activeKey}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            onSelect={onSelect}
                            closeMenu={closeMenu}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const ListDropdown = ({
    listTree,
    label,
    activeKey,
    activePathLabels,
    onSelect,
    className = "",
    showLabel = true,
    align = "right",
}) => {
    const menuRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const initialExpanded = useMemo(
        () => getInitialExpanded(activePathLabels),
        [activePathLabels],
    );
    const [expanded, setExpanded] = useState(initialExpanded);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    }, [isOpen]);

    const openMenu = () => {
        setExpanded((prev) => new Set([...prev, ...initialExpanded]));
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={`relative select-none ${className}`} ref={menuRef}>
            <button
                type="button"
                className="bg-input px-4 py-2 text-white text-sm sm:text-base text-left cursor-pointer inline-flex items-center gap-2 max-w-full"
                onClick={openMenu}
                title={label}
            >
                {showLabel ? (
                    <span className="truncate">{label}</span>
                ) : (
                    <span className="sr-only">{label}</span>
                )}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className="w-3 shrink-0 text-white/70"
                />
            </button>
            {isOpen && (
                <div
                    className={`absolute top-[calc(100%+1rem)] sm:top-[calc(100%+1rem)] z-50 w-[260px] max-h-[360px] overflow-y-auto border border-white/10 bg-level shadow-lg ${
                        align === "left" ? "left-0" : "right-0"
                    }`}
                >
                    {listTree.map((node) => (
                        <ListTreeNode
                            key={node.id}
                            node={node}
                            activeKey={activeKey}
                            expanded={expanded}
                            setExpanded={setExpanded}
                            onSelect={onSelect}
                            closeMenu={() => setIsOpen(false)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
