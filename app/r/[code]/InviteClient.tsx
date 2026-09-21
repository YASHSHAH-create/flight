"use client";

import { useEffect, useRef, useState } from "react";
import { Gift, Smartphone, CheckCircle2 } from "lucide-react";

interface Props {
  code: string;
  name: string | null;
  coins: number;
  stores: { android: string; ios: string };
  clickUrl: string;
}

type Os = "android" | "ios" | "other";

const detectOs = (): Os => {
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac with touch
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "other";
};

// What the app can also read about the same phone after install. Android
// Chrome hands out the real model through UA client hints; iOS only the screen.
const deviceSignals = async (os: Os) => {
  const signals: Record<string, string | number> = {
    os,
    screenW: window.screen?.width || 0,
    screenH: window.screen?.height || 0,
    scale: window.devicePixelRatio || 0,
  };
  try {
    const uaData = (navigator as any).userAgentData;
    if (uaData?.getHighEntropyValues) {
      const hi = await Promise.race([
        uaData.getHighEntropyValues(["model", "platformVersion"]),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 800)),
      ]);
      if (hi?.model) signals.model = hi.model;
      if (hi?.platformVersion) signals.osVersion = hi.platformVersion;
    }
  } catch {
    // no client hints (WebView / Safari) — the screen is the signal
  }
  if (!signals.model && os === "android") {
    // Older Chrome / WebViews still carry "…; SM-G991B Build/…" in the UA
    const m = navigator.userAgent.match(/;\s*([^;()]+?)\s+Build\//);
    if (m) signals.model = m[1];
  }
  return signals;
};

export default function InviteClient({ code, name, coins, stores, clickUrl }: Props) {
  const [os, setOs] = useState<Os>("other");
  const [redirecting, setRedirecting] = useState(false);
  const reported = useRef(false);

  useEffect(() => {
    const detected = detectOs();
    setOs(detected);
    if (reported.current) return;
    reported.current = true;

    (async () => {
      if (clickUrl) {
        const payload = JSON.stringify(await deviceSignals(detected));
        // text/plain beacon: no CORS preflight and it outlives the redirect below
        const sent = navigator.sendBeacon?.(clickUrl, payload);
        if (!sent) {
          fetch(clickUrl, { method: "POST", body: payload, keepalive: true, mode: "no-cors" }).catch(() => {});
        }
      }
      // Phones go straight to their store; desktops stay on the page
      if (detected !== "other") {
        setRedirecting(true);
        setTimeout(() => { window.location.href = detected === "android" ? stores.android : stores.ios; }, 900);
      }
    })();
  }, [clickUrl, stores.android, stores.ios]);

  const storeHref = os === "ios" ? stores.ios : stores.android;
  const copyCode = () => { if (code) navigator.clipboard?.writeText(code).catch(() => {}); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-400">
          <Gift className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          {name ? `${name} invited you to Paymm` : "You're invited to Paymm"}
        </h1>
        <p className="mt-3 text-slate-400">
          Download the app and sign up — <span className="font-bold text-emerald-400">{coins} PayMM Coins (₹{coins})</span> are
          added to your account automatically. No code to type.
        </p>

        <a
          href={storeHref}
          onClick={copyCode}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-500"
        >
          <Smartphone className="h-5 w-5" />
          {redirecting ? "Opening the store…" : os === "ios" ? "Download on the App Store" : "Get it on Google Play"}
        </a>
        {os === "other" && (
          <a href={stores.ios} className="mt-3 block text-sm font-semibold text-blue-400 hover:text-blue-300">
            Using an iPhone? Open the App Store
          </a>
        )}

        <ul className="mt-7 space-y-2 text-left text-sm text-slate-400">
          {["Install Paymm from the store", "Sign up with your mobile number", `${coins} coins land in your account${name ? ` — and ${name} is rewarded too` : ""}`].map((step) => (
            <li key={step} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <span>{step}</span>
            </li>
          ))}
        </ul>

        {code ? (
          <p className="mt-6 text-xs text-slate-500">
            If the coins don&apos;t show up, enter code <span className="font-mono font-bold text-slate-300">{code}</span> in
            Profile → Refer &amp; Earn.
          </p>
        ) : null}
      </div>
    </div>
  );
}
