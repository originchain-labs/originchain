import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.js";
import { CONTRACT_ADDRESSES } from "@originchain/shared-types/constants";
import {
    prepareAsset,
    finalizeMetadata,
    confirmAsset,
    getAssetById,
    getOrCreateProofId,
    updateAssetCertificateCid,
} from "../services/asset.service.js";
import { generateCertificate } from "../services/certificate/certificate.service.js";
import { storageService } from "../services/storage/index.js";

export async function prepare(req: AuthedRequest, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "File is required" } });
        }
        const { title, description } = req.body;
        const result = await prepareAsset(req.file.buffer, req.file.originalname, req.file.mimetype, title, description);
        res.json(result);
    } catch (err) {
        console.error("[asset] prepare failed:", err);
        res.status(502).json({ error: { code: "IPFS_PIN_FAILED", message: "Failed to prepare asset" } });
    }
}

export async function finalize(req: AuthedRequest, res: Response) {
    try {
        const result = await finalizeMetadata(req.body);
        res.json(result);
    } catch (err) {
        console.error("[asset] finalize-metadata failed:", err);
        res.status(502).json({ error: { code: "IPFS_PIN_FAILED", message: "Failed to pin metadata" } });
    }
}

export async function confirm(req: AuthedRequest, res: Response) {
    try {
        const { contentHash, ipfsCid, metadataCid, txHash, finalMetadata } = req.body;
        const asset = await confirmAsset(req.walletAddress!, contentHash, ipfsCid, metadataCid, txHash, finalMetadata);
        res.status(201).json({ asset });
    } catch (err) {
        const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";
        const errorMap: Record<string, { status: number; code: string }> = {
            CREATOR_NOT_FOUND: { status: 404, code: "CREATOR_NOT_FOUND" },
            ASSET_ALREADY_REGISTERED: { status: 409, code: "ASSET_ALREADY_REGISTERED" },
            TX_NOT_FOUND_ON_CHAIN: { status: 400, code: "TX_NOT_FOUND_ON_CHAIN" },
        };
        const mapped = errorMap[message] || { status: 500, code: "UNKNOWN_ERROR" };
        res.status(mapped.status).json({ error: { code: mapped.code, message } });
    }
}

export async function getCertificate(req: AuthedRequest, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(404).json({ error: { code: "CERTIFICATE_NOT_FOUND", message: "Asset not registered" } });
        }
        const asset = await getAssetById(id);
        if (!asset || !asset.onChainConfirmed) {
            return res.status(404).json({ error: { code: "CERTIFICATE_NOT_FOUND", message: "Asset not registered" } });
        }

        let cid = asset.certificateCid;
        if (!cid) {
            const proofId = await getOrCreateProofId(asset.id);
            const verificationUrl = `${process.env.FRONTEND_URL}/verify/${proofId}`;
            cid = await generateCertificate({
                proofId,
                assetTitle: asset.title,
                creatorDisplayName: asset.creator.displayName,
                creatorWalletAddress: asset.creator.walletAddress,
                contentHash: asset.contentHash,
                metadataCid: asset.metadataCid,
                txHash: asset.txHash!,
                contractAddress: CONTRACT_ADDRESSES.arbitrumSepolia.assetRegistry,
                network: "Arbitrum Sepolia",
                registeredAt: asset.registeredAt!,
                artworkIpfsCid: asset.ipfsCid,
                verificationUrl,
            });
            await updateAssetCertificateCid(asset.id, cid);
        }

        res.json({
            certificateUrl: storageService.getGatewayUrl(cid),
            qrCodeUrl: storageService.getGatewayUrl(cid), // QR is embedded in the PDF itself
        });
    } catch (err) {
        console.error("[asset] certificate generation failed:", err);
        // Per API_SPECIFICATION.md: falls back gracefully, never blocks core flow.
        res.status(404).json({ error: { code: "CERTIFICATE_NOT_FOUND", message: "Certificate generation failed" } });
    }
}