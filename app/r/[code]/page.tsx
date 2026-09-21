import type { Metadata } from "next";
import InviteClient from "./InviteClient";

// Referral link: www.paymm.in/r/<CODE>. The page reports the tap to the pg
// server and sends the visitor to their app store; after signup the app is
// matched back to this tap, so the friend's code is applied without typing it.

const PG_URL = process.env.NEXT_PUBLIC_PG_URL || "https://api.paymm.in/pg";
const PLAY_URL = "https://play.google.com/store/apps/details?id=in.paymm.app";
const APPSTORE_URL = "https://apps.apple.com/app/id6780256299";

interface LinkInfo {
  valid: boolean;
  code: string | null;
  name: string | null;
  coins: number;
  stores: { android: string; ios: string };
}

const cleanCode = (raw: string) => decodeURIComponent(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);

async function getLinkInfo(code: string): Promise<LinkInfo> {
  const fallback: LinkInfo = { valid: false, code: null, name: null, coins: 30, stores: { android: PLAY_URL, ios: APPSTORE_URL } };
  if (code.length < 6) return fallback;
  try {
    const res = await fetch(`${PG_URL}/api/referral/link/${code}`, { cache: "no-store", signal: AbortSignal.timeout(6000) });
    if (!res.ok) return fallback;
    const data = await res.json();
    return { ...fallback, ...data, stores: { ...fallback.stores, ...(data?.stores || {}) } };
  } catch {
    // pg unreachable: the page still works as a plain download page
    return fallback;
  }
}

export const metadata: Metadata = {
  title: "You're invited to Paymm — get PayMM Coins on signup",
  description: "Download the Paymm app with your friend's invite and get PayMM Coins on signup. Book flights, buses and hotels.",
  robots: { index: false, follow: false },
};

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = cleanCode(raw);
  const info = await getLinkInfo(code);
  return (
    <InviteClient
      code={info.valid ? code : ""}
      name={info.name}
      coins={info.coins}
      stores={info.stores}
      clickUrl={info.valid ? `${PG_URL}/api/referral/link/${code}/click` : ""}
    />
  );
}
