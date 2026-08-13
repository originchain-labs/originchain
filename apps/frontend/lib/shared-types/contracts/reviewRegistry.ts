export const reviewRegistryAbi = [
    {
        type: "function",
        name: "submitReview",
        inputs: [
            { name: "assetHash", type: "bytes32" },
            { name: "rating", type: "uint8" },
            { name: "commentCid", type: "string" },
            { name: "creatorRegistry", type: "address" },
            { name: "assetRegistry", type: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "getReview",
        inputs: [
            { name: "assetHash", type: "bytes32" },
            { name: "reviewer", type: "address" },
        ],
        outputs: [
            { name: "", type: "uint8" },
            { name: "", type: "string" },
            { name: "", type: "uint64" },
            { name: "", type: "bool" },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getReviewCount",
        inputs: [{ name: "assetHash", type: "bytes32" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
] as const;
