import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { cookieStorage, createStorage } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3a7000f10c4055b3977e616598edd5e0";

export const wagmiConfig = getDefaultConfig({
    appName: "OriginChain",
    projectId,
    chains: [arbitrumSepolia, arbitrum],
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});