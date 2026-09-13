import { useEffect, useState } from "react";
import toast, { useToasterStore } from "react-hot-toast";

const loadStoredValue = (key, defaultValue, transform) => {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : defaultValue;
    return transform ? transform(parsed) : parsed;
};

export const usePersistedState = (key, defaultValue, transform) => {
    const [state, setState] = useState(() =>
        loadStoredValue(key, defaultValue, transform),
    );

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
};

export const usePolledStorage = (key, defaultValue, transform) => {
    const [state, setState] = useState(() =>
        loadStoredValue(key, defaultValue, transform),
    );

    useEffect(() => {
        const refresh = () =>
            setState(loadStoredValue(key, defaultValue, transform));
        const handleStorageChange = (e) => {
            if (e.key === key) refresh();
        };
        window.addEventListener("storage", handleStorageChange);
        const interval = setInterval(refresh, 1000);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    return state;
};

export const usePageTitle = (title = "GDSR") => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};

export const useToastLimit = (limit = 3) => {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= limit)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts, limit]);
};
