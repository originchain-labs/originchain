import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { storageService } from "../storage/index.js";

interface CertificateData {
    proofId: string;
    assetTitle: string;
    creatorDisplayName: string;
    creatorWalletAddress: string;
    contentHash: string;
    metadataCid: string;
    txHash: string;
    contractAddress: string;
    registeredAt: Date;
    verificationUrl: string;
    artworkIpfsCid: string;
    network: string; // e.g. "Arbitrum Sepolia"
}

const INK = rgb(0.094, 0.094, 0.106);
const MUTE = rgb(0.443, 0.443, 0.478);
const LINE = rgb(0.894, 0.894, 0.906);
const FAINT = rgb(0.631, 0.631, 0.667);
const ACCENT = rgb(0.082, 0.502, 0.239);

function truncate(value: string, head = 10, tail = 6): string {
    if (value.length <= head + tail + 3) return value;
    return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

function formatTimestamp(date: Date): string {
    const human = date.toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "2-digit", timeZoneName: "short",
    });
    return `${human}  (${date.toISOString()})`;
}

async function fetchArtworkImage(pdfDoc: PDFDocument, cid: string) {
    try {
        const url = storageService.getGatewayUrl(cid);
        const res = await fetch(url);
        if (!res.ok) return null;
        const contentType = res.headers.get("content-type") ?? "";
        const bytes = new Uint8Array(await res.arrayBuffer());

        if (contentType.includes("png")) return pdfDoc.embedPng(bytes);
        if (contentType.includes("jpeg") || contentType.includes("jpg")) return pdfDoc.embedJpg(bytes);
        return null; // Not an embeddable raster format (e.g. video, PDF, unsupported type) — degrade gracefully.
    } catch {
        return null;
    }
}

export async function generateCertificate(data: CertificateData): Promise<string> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);
    const { width, height } = page.getSize();
    const margin = 50;
    const contentWidth = width - margin * 2;
    let y = height - 60;

    // Header
    page.drawText("ORIGINCHAIN", { x: margin, y, size: 20, font: boldFont, color: INK });
    page.drawText("Own Your Creativity. Prove Your Origin.", {
        x: width - margin - font.widthOfTextAtSize("Own Your Creativity. Prove Your Origin.", 9),
        y: y + 2, size: 9, font, color: MUTE,
    });
    y -= 22;
    page.drawText("PROOF OF ORIGIN CERTIFICATE", { x: margin, y, size: 11, font, color: MUTE });
    y -= 14;
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.75, color: LINE });
    y -= 30;

    // Verified badge. The check mark is drawn as vector lines rather than a
    // "\u2713" glyph because pdf-lib's WinAnsi standard-font encoding cannot
    // represent that code point and throws.
    page.drawLine({ start: { x: margin, y: y + 1.5 }, end: { x: margin + 3, y: y - 2 }, thickness: 1.4, color: ACCENT });
    page.drawLine({ start: { x: margin + 3, y: y - 2 }, end: { x: margin + 8.5, y: y + 5.5 }, thickness: 1.4, color: ACCENT });
    page.drawText(`VERIFIED ON ${data.network.toUpperCase()}`, {
        x: margin + 15, y, size: 9, font: boldFont, color: ACCENT,
    });
    y -= 26;

    // Artwork preview (degrades gracefully if unavailable/unsupported format)
    const artworkImage = await fetchArtworkImage(pdfDoc, data.artworkIpfsCid);
    if (artworkImage) {
        const artHeight = contentWidth * 0.55;
        const scaled = artworkImage.scaleToFit(contentWidth, artHeight);
        const offsetX = margin + (contentWidth - scaled.width) / 2;
        page.drawImage(artworkImage, { x: offsetX, y: y - artHeight, width: scaled.width, height: scaled.height });
        page.drawRectangle({
            x: margin, y: y - artHeight, width: contentWidth, height: artHeight,
            borderColor: LINE, borderWidth: 1,
        });
        y -= artHeight + 22;
    }
    // If artworkImage is null, we simply skip the preview block — no broken
    // image placeholder, per the graceful-degradation principle used
    // throughout this project's AI/storage layers.

    // Title / creator
    page.drawText(data.assetTitle, { x: margin, y, size: 16, font: boldFont, color: INK });
    y -= 18;
    page.drawText(`Registered by ${data.creatorDisplayName}`, { x: margin, y, size: 10, font, color: MUTE });
    y -= 20;
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.75, color: LINE });
    y -= 26;

    const col1X = margin;
    const col2X = margin + contentWidth * 0.52;
    const rowH = 30;

    function drawField(x: number, yy: number, label: string, value: string, mono = false) {
        page.drawText(label.toUpperCase(), { x, y: yy, size: 7.5, font: boldFont, color: FAINT });
        page.drawText(value, { x, y: yy - 13, size: 9.5, font: mono ? monoFont : font, color: INK });
    }

    drawField(col1X, y, "Proof ID", data.proofId);
    drawField(col2X, y, "Network", data.network);
    y -= rowH;

    drawField(col1X, y, "Registered At", formatTimestamp(data.registeredAt));
    y -= rowH;

    drawField(col1X, y, "Content Hash", truncate(data.contentHash), true);
    drawField(col2X, y, "Metadata CID", truncate(data.metadataCid), true);
    y -= rowH;

    drawField(col1X, y, "Creator Wallet", truncate(data.creatorWalletAddress), true);
    drawField(col2X, y, "Contract Address", truncate(data.contractAddress), true);
    y -= rowH;

    drawField(col1X, y, "Transaction Hash", truncate(data.txHash, 14, 8), true);
    y -= rowH + 6;

    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.75, color: LINE });
    y -= 28;

    // QR + verify
    const qrBuffer = await QRCode.toBuffer(data.verificationUrl, { width: 300, margin: 1 });
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    const qrSize = 88;
    page.drawImage(qrImage, { x: margin, y: y - qrSize, width: qrSize, height: qrSize });

    const textX = margin + qrSize + 18;
    page.drawText("SCAN TO VERIFY", { x: textX, y: y - 14, size: 10, font: boldFont, color: INK });
    page.drawText(truncate(data.verificationUrl, 40, 10), { x: textX, y: y - 28, size: 8, font, color: MUTE });
    page.drawText("Independent verification via the OriginChain platform, using", { x: textX, y: y - 42, size: 8, font, color: FAINT });
    page.drawText("the content hash and on-chain registration record.", { x: textX, y: y - 53, size: 8, font, color: FAINT });
    y -= qrSize + 20;

    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.75, color: LINE });
    y -= 18;

    // Disclaimer — matches integrity rules exactly
    const disclaimerLines = [
        "This certificate represents a blockchain registration of the referenced asset and associated metadata at the recorded timestamp.",
        "It is a shareable proof artifact, not a legal claim of copyright ownership. Independent verification should be performed",
        "through the OriginChain platform using the content hash or QR code above.",
    ];
    for (const line of disclaimerLines) {
        page.drawText(line, { x: margin, y, size: 7.5, font, color: FAINT });
        y -= 11;
    }
    y -= 8;
    const tagline = "Own Your Creativity. Prove Your Origin.";
    page.drawText(tagline, {
        x: width / 2 - font.widthOfTextAtSize(tagline, 9) / 2,
        y, size: 9, font, color: MUTE,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfFile = new File([new Uint8Array(pdfBytes)], `certificate-${data.contentHash}.pdf`, {
        type: "application/pdf",
    });

    const { cid } = await storageService.pinFile(pdfFile);
    return cid;
}