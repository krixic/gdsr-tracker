import React from "react";
import { Toaster } from "react-hot-toast";

export const LevelsToaster = () => {
    return (
        <Toaster
            containerClassName="copytoastcontainer"
            toastOptions={{
                duration: 2000,
                style: {
                    borderRadius: 0,
                    padding: "0 16px",
                    color: "white",
                    height: "50px",
                    fontFamily: "Readex Pro",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
                    userSelect: "none",
                    display: "inline-flex",
                    maxWidth: "90vw",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
                success: {
                    style: {
                        background: "rgb(0, 180, 0)",
                    },
                },
                error: {
                    style: {
                        background: "rgb(180, 0, 0)",
                    },
                },
            }}
        />
    );
};
