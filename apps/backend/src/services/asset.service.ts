export async function finalizeMetadata(finalMetadata: { title: string; description?: string; tags?: string[] }) {
    const metadataDoc = {
        version: 1,
        schema: "originchain.asset.v1",
        title: finalMetadata.title,
        description: finalMetadata.description ?? "",
        tags: finalMetadata.tags ?? [],
    };
    const { cid: metadataCid } = await storageService.pinJSON(metadataDoc);
    return { metadataCid };
}

export async function confirmAsset(
    walletAddress: string,
    contentHash: string,
    ipfsCid: string,
    metadataCid: string,
    txHash: `0x${string}`,
    finalMetadata: { title: string; description?: string; tags?: string[] }
) {
    const creator = await prisma.creator.findUnique({ where: { walletAddress } });
    if (!creator) throw new Error("CREATOR_NOT_FOUND");

    const existing = await prisma.asset.findUnique({ where: { contentHash } });
    if (existing) throw new Error("ASSET_ALREADY_REGISTERED");

    const receipt = await chainClient.getTransactionReceipt({ hash: txHash }).catch(() => null);
    if (!receipt || receipt.status !== "success") {
        throw new Error("TX_NOT_FOUND_ON_CHAIN");
    }

    // No re-pinning here — ipfsCid/metadataCid are exactly what was signed
    // on-chain, per the fix agreed for consistency between chain and DB.
    const asset = await prisma.asset.create({
        data: {
            creatorId: creator.id,
            contentHash,
            ipfsCid,
            metadataCid,
            title: finalMetadata.title,
            description: finalMetadata.description,
            txHash,
            registeredAt: new Date(),
            onChainConfirmed: true,
        },
    });

    return asset;
}