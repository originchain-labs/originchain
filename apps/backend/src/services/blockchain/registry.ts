import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";
import { creatorRegistryAbi } from "@originchain/shared-types/contracts/creatorRegistry";
import { assetRegistryAbi } from "@originchain/shared-types/contracts/assetRegistry";
import { reviewRegistryAbi } from "@originchain/shared-types/contracts/reviewRegistry";
import { reputationManagerAbi } from "@originchain/shared-types/contracts/reputationManager";

export const chainClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(process.env.RPC_URL),
});

export const CONTRACTS = {
    creatorRegistry: {
        address: CONTRACT_ADDRESSES.arbitrumSepolia.creatorRegistry as `0x${string}`,
        abi: creatorRegistryAbi,
    },
    assetRegistry: {
        address: CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry as `0x${string}`,
        abi: assetRegistryAbi,
    },
    reviewRegistry: {
        address: CONTRACT_ADDRESSES.arbitrumSepolia.reviewRegistry as `0x${string}`,
        abi: reviewRegistryAbi,
    },
    reputationManager: {
        address: CONTRACT_ADDRESSES.arbitrumSepolia.reputationManager as `0x${string}`,
        abi: reputationManagerAbi,
    },
} as const;
