import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { WalletChildrenProvider } from "../context/wallet";
import { TRPCReactProvider } from "~/trpc/react";
import { PresaleProvider } from "~/context/PresaleContext";

export const metadata: Metadata = {
  title: "Stories.fun",
  description:
    "Stories.fun is a social media platform for creators to share their stories and launch tokens related to their stories.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <WalletChildrenProvider>
            <PresaleProvider>{children}</PresaleProvider>
          </WalletChildrenProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
