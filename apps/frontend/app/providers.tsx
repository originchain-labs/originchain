"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider, cookieToInitialState } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi-config";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export function Providers({
    children,
    cookie,
}: {
    children: React.ReactNode;
    cookie?: string | null;
}) {
    const initialState = cookieToInitialState(wagmiConfig, cookie);

    return (
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}