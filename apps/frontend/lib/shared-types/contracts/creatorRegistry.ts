export const creatorRegistryAbi = [
    {
        type: "function",
        name: "registerCreator",
        inputs: [{ name: "profileCid", type: "string" }],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "isRegistered",
        inputs: [{ name: "creator", type: "address" }],
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
    },
] as const;
