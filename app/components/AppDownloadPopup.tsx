"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Plane, Bus, Hotel, Coins } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { COMPANY } from "@/app/lib/company";

// Site-wide "download the app" popup. Shown once per visit (sessionStorage
// flag, so it comes back every time the site is opened in a new tab/session
// but not on every page within one visit), after a short delay so the page
// content loads first.
// iOS visitors go to the App Store, everyone else to Google Play; desktop
// visitors get both buttons because there is no store to pick from.

const STORAGE_KEY = "paymm_app_popup_seen_session";
const SHOW_DELAY_MS = 2500;

// Pages where the popup would get in the way or is redundant.
const SKIP_PREFIXES = ["/admin", "/r/", "/downloads", "/delete-account", "/api"];

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  const ua = navigator.userAgent || "";
  // iPadOS 13+ reports as Macintosh but has touch points.
  const isIpadOs = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/i.test(ua) || isIpadOs) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function isInsideApp(): boolean {
  const ua = navigator.userAgent || "";
  // Android WebView ("; wv)") or a React Native WebView bridge: the visitor is
  // already inside the Paymm app, so never ask them to download it.
  if (/; wv\)/i.test(ua)) return true;
  return typeof (window as unknown as { ReactNativeWebView?: unknown }).ReactNativeWebView !== "undefined";
}

function isBot(): boolean {
  return /bot|crawler|spider|crawling|lighthouse|headless/i.test(navigator.userAgent || "");
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Blocked storage: the popup may show again on the next page.
  }
}

export default function AppDownloadPopup() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return;
    if (isBot() || isInsideApp()) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // storage unavailable: still show once this session
    }
    setPlatform(detectPlatform());
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
    // Intentionally run once on mount: navigating between pages must not re-open it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    markSeen();
    setOpen(false);
  };

  const download = (store: "ios" | "android") => {
    markSeen();
    setOpen(false);
    const url = store === "ios" ? COMPANY.social.appStore : COMPANY.social.playStore;
    // Same tab on phones so the store app takes over; new tab on desktop.
    if (platform === "desktop") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  };

  if (!open) return null;

  const primaryStore: "ios" | "android" = platform === "ios" ? "ios" : "android";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-popup-title"
      onClick={close}
    >
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-[appPopupIn_.35s_cubic-bezier(.2,.8,.2,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-ink-2 hover:bg-white hover:text-ink shadow"
        >
          <X size={18} />
        </button>

        <div className="bg-gradient-to-br from-brand to-brand-deep px-6 pt-8 pb-6 text-white">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/paymm.png"
              alt="Paymm app"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl shadow-lg ring-2 ring-white/30"
            />
            <div>
              <h2 id="app-popup-title" className="font-display text-xl font-extrabold leading-tight">
                Get the Paymm App
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Flights, buses, hotels &amp; recharges — faster in the app.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-2">
            <li className="flex items-center gap-2"><Coins size={16} className="text-gold" /> Earn PayMM Coins</li>
            <li className="flex items-center gap-2"><Plane size={16} className="text-brand" /> Flat ₹200 off flights</li>
            <li className="flex items-center gap-2"><Bus size={16} className="text-brand" /> Bus seat booking</li>
            <li className="flex items-center gap-2"><Hotel size={16} className="text-brand" /> Hotel deals</li>
          </ul>

          <div className="mt-5 flex flex-col gap-2.5">
            {platform === "desktop" ? (
              <>
                <button
                  type="button"
                  onClick={() => download("android")}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-4 py-3 text-base font-bold text-white hover:bg-brand-hover active:scale-[.98] transition"
                >
                  <FaGooglePlay /> Get it on Google Play
                </button>
                <button
                  type="button"
                  onClick={() => download("ios")}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-base font-bold text-white hover:bg-black active:scale-[.98] transition"
                >
                  <FaApple /> Download on the App Store
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => download(primaryStore)}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-4 py-3.5 text-base font-bold text-white hover:bg-brand-hover active:scale-[.98] transition"
              >
                {primaryStore === "ios" ? <FaApple size={18} /> : <FaGooglePlay size={16} />}
                {primaryStore === "ios" ? "Download on the App Store" : "Get it on Google Play"}
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="w-full py-2 text-sm font-semibold text-ink-3 hover:text-ink-2"
            >
              Continue on website
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
