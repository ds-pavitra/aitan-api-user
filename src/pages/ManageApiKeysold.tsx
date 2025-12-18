import { useState, useEffect, FormEvent } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Alert from "../components/ui/alert/Alert";

const DEMO_PASSWORD = "admin123";

function generateApiKey(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

type AlertState =
  | {
      variant: "success" | "error" | "warning" | "info";
      title: string;
      message: string;
    }
  | null;

export default function ManageApiKeys() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  // modal state for password entry
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // alert state
  const [alert, setAlert] = useState<AlertState>(null);

  const masked = apiKey ? "••••••••••••••••••••••••••••••" : "";

  // 🔹 Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      setAlert(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [alert]);

  const handleGenerate = () => {
    setApiKey(generateApiKey());
    setShowKey(false);
    setAlert({
      variant: "info",
      title: "New API key generated",
      message:
        "A new encrypted API key has been created. Use the View button to reveal it after password verification.",
    });
  };

  const handleOpenPasswordModal = () => {
    if (!apiKey) {
      setAlert({
        variant: "warning",
        title: "No API key yet",
        message: "Please generate an API key before trying to view it.",
      });
      return;
    }
    setPasswordInput("");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  };

  const handleConfirmPassword = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEMO_PASSWORD) {
      setShowKey(true);
      setIsPasswordModalOpen(false);
      setAlert({
        variant: "success",
        title: "Password verified",
        message: "The API key is now visible. You can copy it safely.",
      });
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleCopy = async () => {
    if (!apiKey) {
      setAlert({
        variant: "warning",
        title: "No API key to copy",
        message: "Generate an API key before copying.",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(apiKey);
      setAlert({
        variant: "success",
        title: "Copied to clipboard",
        message: "The API key has been copied. Store it in a safe place.",
      });
    } catch {
      setAlert({
        variant: "error",
        title: "Copy failed",
        message:
          "Could not copy the key automatically. Please copy it manually.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordInput("");
    setPasswordError("");
  };

  return (
    <>
      <PageMeta
        title="Manage API Keys | TailAdmin - React.js Admin Dashboard Template"
        description="Manage API keys: generate, view (password protected) and copy keys in TailAdmin React.js Tailwind CSS Admin Dashboard."
      />
      <PageBreadcrumb pageTitle="Manage API Keys" />

      {/* 🔹 Toast-style alert top-right with close button */}
      {alert && (
        <div className="fixed top-4 right-4 z-[99999]">
          <div className="relative min-w-[260px] max-w-sm">
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
            />
            <button
              type="button"
              onClick={() => setAlert(null)}
              className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <span className="sr-only">Dismiss</span>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Manage API Keys
        </h3>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900 dark:text-white">
                New API key
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click &quot;Generate key&quot; to create an encrypted API key.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Generate key
            </button>
          </div>

          <div className="mt-5 space-y-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              Encrypted API key
            </label>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                readOnly
                className="h-10 w-full rounded-full border border-gray-200 bg-transparent px-3 text-xs text-gray-900 outline-none dark:border-gray-800 dark:text-white"
                placeholder='Click "Generate key" to create a key'
                value={apiKey ? (showKey ? apiKey : masked) : ""}
              />
              <div className="flex gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenPasswordModal}
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!showKey} // disables copy until key is revealed
                  className={`inline-flex h-10 flex-1 items-center justify-center rounded-full px-3 text-xs font-medium transition
                    ${
                      showKey
                        ? "border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
                        : "border border-gray-300 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600"
                    }`}
                >
                  Copy
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Demo password is{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px] text-indigo-600 dark:bg-gray-800 dark:text-indigo-300">
                admin123
              </code>
              . In production, verify the password on your backend and never
              expose raw keys directly in the browser.
            </p>
          </div>
        </div>
      </div>

      {/* Password modal like Logs modal */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 px-4"
          style={{ zIndex: "99999" }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Enter password to view API key
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
                  placeholder="Enter your password"
                />
                {passwordError && (
                  <p className="mt-1 text-[11px] text-rose-500">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex items-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
