import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
    appName: "OriginChain",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [arbitrumSepolia, arbitrum],
    ssr: true,
});