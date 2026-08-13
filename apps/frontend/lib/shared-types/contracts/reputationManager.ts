export const reputationManagerAbi = [
    {
        type: "function",
        name: "recomputeScore",
        inputs: [
            { name: "creator", type: "address" },
            { name: "assetRegistry", type: "address" },
            { name: "reviewRegistry", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "getScore",
        inputs: [{ name: "creator", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getLastComputed",
        inputs: [{ name: "creator", type: "address" }],
        outputs: [{ name: "", type: "uint64" }],
        stateMutability: "view",
    },
] as const;
