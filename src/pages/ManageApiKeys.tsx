import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Alert from "../components/ui/alert/Alert";

interface ApiKeyRow {
  id: number;
  label: string;
  key: string;
  maskedKey: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "disabled";
}

function generateApiKey(length = 32) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function maskKey(key: string) {
  if (!key) return "";
  return `${key.slice(0, 8)}****${key.slice(-4)}`;
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date = new Date()) {
  return `Today, ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function ManageApiKeys() {
  const [apiKey, setApiKey] = useState<ApiKeyRow>({
    id: 1,
    label: "Primary API Key",
    key: "",
    maskedKey: "Not generated yet",
    createdAt: "-",
    lastUsed: "-",
    status: "disabled",
  });

  const [rawKey, setRawKey] = useState<string | null>(null);
  const [alert, setAlert] = useState<any>(null);

  // Auto hide raw key after 2 minutes
  useEffect(() => {
    if (!rawKey) return;

    const timer = setTimeout(() => {
      setRawKey(null);
      setAlert({
        variant: "info",
        title: "Key hidden",
        message:
          "The API key has been hidden for security. Regenerate if required.",
      });
    }, 2 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [rawKey]);

  const handleGenerate = () => {
    const newKey = generateApiKey();
    const now = new Date();

    setApiKey({
      ...apiKey,
      key: newKey,
      maskedKey: maskKey(newKey),
      createdAt: formatDate(now),
      lastUsed: formatTime(now),
      status: "active",
    });

    setRawKey(newKey);

    setAlert({
      variant: "success",
      title: "API key generated",
      message:
        "Please copy and store this key securely. It will disappear in 2 minutes.",
    });
  };

  return (
    <>
      <PageMeta title="Manage API Key" description="Generate and manage API key" />
      <PageBreadcrumb pageTitle="API Keys" />

      {alert && (
        <div className="fixed top-4 right-4 z-[9999] max-w-sm">
          <Alert {...alert} />
        </div>
      )}

      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] lg:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            API Key
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You can generate one API key for authentication.
          </p>
        </div>

        {/* Header */}
        <div className="hidden md:grid md:grid-cols-12 border-b pb-3 text-xs font-semibold text-gray-400">
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Last Used</div>
        </div>

        {/* Row */}
        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {apiKey.label}
            </p>
            <div className="rounded-xl border bg-gray-50 px-3 py-2 text-xs dark:bg-gray-900">
              {apiKey.maskedKey}
            </div>
          </div>

          <div className="md:col-span-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                apiKey.status === "active"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-500"
              }`}
            >
              {apiKey.status === "active" ? "Active" : "Disabled"}
            </span>
          </div>

          <div className="md:col-span-2 text-sm text-gray-600">
            {apiKey.createdAt}
          </div>

          <div className="md:col-span-2 text-sm text-gray-600">
            {apiKey.lastUsed}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            {apiKey.key ? "Regenerate Key" : "Generate Key"}
          </button>
        </div>

        {/* Raw Key Display */}
        {rawKey && (
          <div className="mt-6 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-700">
            <p className="mb-1 font-medium">
              ⚠️ Copy this key now and store it securely
            </p>
            <p className="break-all font-mono">{rawKey}</p>
            <p className="mt-2 text-xs">
              This key will disappear in <strong>2 minutes</strong>. If lost,
              you must regenerate.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
