// utils/confirmToast.js
import { toast } from "react-toastify";
import React from "react";

export function confirmToast({
  title = "Delete this note?",
  message = "This action can’t be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
} = {}) {
  return new Promise((resolve) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-2 text-sm text-slate-900 dark:text-white">
          <p className="font-semibold">{title}</p>
          <p className="text-slate-600 dark:text-slate-300">{message}</p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                resolve(true);
                closeToast();
              }}
              className="flex-1 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition cursor-pointer"
            >
              {confirmLabel}
            </button>
            <button
              onClick={() => {
                resolve(false);
                closeToast();
              }}
              className="flex-1 py-1.5 rounded border border-slate-300 dark:border-white/20 bg-white hover:bg-slate-100 text-slate-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white cursor-pointer transition"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      ),
      {
        toastId: "confirm-delete",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
        pauseOnHover: false,
        position: "bottom-center",
        onClose: () => resolve(false),
        style: {
          background: "#ffffff", // Light mode background
          color: "#1f2937",      // Tailwind slate-800
          borderRadius: "0.75rem",
          padding: "1rem",
        },
        className: "dark:!bg-slate-800 dark:!text-white", // Tailwind dark mode overrides
      }
    );
  });
}
