import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile | Paymm",
    description: "Manage your Paymm account and preferences.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
