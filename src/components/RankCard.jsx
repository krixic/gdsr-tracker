import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import toast from "react-hot-toast";
import { getLevelKey } from "../util.js";

const IconButton = React.memo(({ onClick, icon, active = true, bg }) => (
    <button
        onClick={onClick}
        disabled={!active}
        className={`flex items-center justify-center px-1 ${bg} ${
            active ? "cursor-pointer" : "cursor-default"
        }`}
    >
        <FontAwesomeIcon icon={icon} className={active ? "" : "opacity-0"} />
    </button>
));

export const RankCard = ({
    level,
    progress,
    attempts,
    duplicateIds,
    cycleLevel,
    setDoingValue,
    setAttemptsValue,
    rankColor,
    rankLabel,
    showAttempts = false,
}) => {
    const levelKey = getLevelKey(level, duplicateIds);
    const value = progress[levelKey];
    const stringValue = value === undefined ? "" : String(value);
    const isCompleted = value === 100;
    const isDoing = value !== undefined && value < 100;
    const bgClass = isCompleted
        ? "bg-completed"
        : isDoing
          ? "bg-doing"
          : "bg-level";

    const [prevValue, setPrevValue] = useState(stringValue);
    const [inputValue, setInputValue] = useState(stringValue);
    const attemptValue = attempts[levelKey];
    const stringAttemptValue =
        attemptValue === undefined ? "" : String(attemptValue);
    const [prevAttemptValue, setPrevAttemptValue] =
        useState(stringAttemptValue);
    const [attemptInputValue, setAttemptInputValue] =
        useState(stringAttemptValue);

    if (stringValue !== prevValue) {
        setPrevValue(stringValue);
        setInputValue(stringValue);
    }

    if (stringAttemptValue !== prevAttemptValue) {
        setPrevAttemptValue(stringAttemptValue);
        setAttemptInputValue(stringAttemptValue);
    }

    const commitInput = () => {
        const num = parseInt(inputValue, 10);
        if (isNaN(num)) {
            setInputValue(stringValue);
            return;
        }
        setDoingValue(levelKey, num);
    };

    const commitAttemptInput = () => {
        if (attemptInputValue === "") {
            setAttemptsValue(levelKey, "");
            return;
        }

        const num = parseInt(attemptInputValue, 10);

        // nan aura
        if (isNaN(num) || num < 0) {
            setAttemptInputValue(stringAttemptValue);
            return;
        }

        setAttemptsValue(levelKey, num);
    };

    return (
        <div
            className="flex flex-row justify-between text-md text-center select-none [content-visibility:auto] [contain-intrinsic-size:32px]"
            onContextMenu={(e) => {
                e.preventDefault();
                setDoingValue(levelKey, 100, true);
            }}
        >
            <IconButton
                bg={bgClass}
                icon={faCopy}
                onClick={() => {
                    const copyValue = level.copyValue ?? level.id;
                    navigator.clipboard.writeText(String(copyValue));
                    toast.success(
                        level.id
                            ? `Copied ${level.name} (${level.id})`
                            : `Copied ${level.name}`,
                    );
                }}
            />
            <IconButton
                bg={bgClass}
                icon={faYoutube}
                active={Boolean(level.video)}
                onClick={() =>
                    level.video &&
                    window.open(level.video, "_blank", "noopener,noreferrer")
                }
            />
            <div
                onClick={() => cycleLevel(levelKey)}
                onMouseEnter={(event) => {
                    const element = event.currentTarget;
                    if (element.scrollWidth > element.clientWidth) {
                        element.title = level.name;
                        element.setAttribute("aria-label", level.name);
                    } else {
                        element.removeAttribute("title");
                        element.removeAttribute("aria-label");
                    }
                }}
                onFocus={(event) => {
                    const element = event.currentTarget;
                    if (element.scrollWidth > element.clientWidth) {
                        element.title = level.name;
                        element.setAttribute("aria-label", level.name);
                    }
                }}
                className={`py-[3px] px-2 w-full cursor-pointer text-nowrap truncate ${bgClass}`}
            >
                {level.name}
            </div>

            {rankColor && (
                <div
                    className={showAttempts ? "w-[70px]" : "w-[55px]"}
                    style={{ backgroundColor: rankColor }}
                    title={rankLabel}
                    aria-label={rankLabel}
                />
            )}

            <input
                className="bg-input py-[3px] px-2 w-[35%] focus:outline-none"
                type="number"
                value={inputValue}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={commitInput}
                onKeyDown={(e) => e.key === "Enter" && commitInput()}
                placeholder="0"
            />

            {showAttempts && (
                <input
                    className="bg-input py-[3px] px-2 w-[35%] focus:outline-none"
                    type="number"
                    value={attemptInputValue}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setAttemptInputValue(e.target.value)}
                    onBlur={commitAttemptInput}
                    onKeyDown={(e) => e.key === "Enter" && commitAttemptInput()}
                    placeholder="0"
                />
            )}
        </div>
    );
};
