export const assetRegistryAbi = [
    {
        type: "function",
        name: "registerAsset",
        inputs: [
            { name: "hash", type: "bytes32" },
            { name: "ipfsCid", type: "string" },
            { name: "metadataCid", type: "string" },
            { name: "creatorRegistry", type: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "assetExists",
        inputs: [{ name: "hash", type: "bytes32" }],
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
    },
] as const;