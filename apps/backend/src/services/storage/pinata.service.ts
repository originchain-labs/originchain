import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT!,
    pinataGateway: process.env.PINATA_GATEWAY_URL!,
});

export async function pinFile(file: File): Promise<string> {
    const upload = await pinata.upload.public.file(file);
    return upload.cid;
}

export async function pinJSON(data: object): Promise<string> {
    const upload = await pinata.upload.public.json(data);
    return upload.cid;
}

export function getGatewayUrl(cid: string): string {
    return `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`;
}