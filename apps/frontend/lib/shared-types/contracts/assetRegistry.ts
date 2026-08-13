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
    {
        type: "function",
        name: "getAsset",
        inputs: [{ name: "hash", type: "bytes32" }],
        outputs: [
            { name: "", type: "address" },
            { name: "", type: "string" },
            { name: "", type: "string" },
            { name: "", type: "uint64" },
            { name: "", type: "bool" },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getAssetsByCreator",
        inputs: [{ name: "creator", type: "address" }],
        outputs: [{ name: "", type: "bytes32[]" }],
        stateMutability: "view",
    },
] as const;
