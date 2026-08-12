import { PinataSDK } from "pinata";
import type { StorageService, PinResult } from "../storage.interface.js";

export class PinataProvider implements StorageService {
  private pinata: PinataSDK;

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.PINATA_GATEWAY_URL!,
    });
  }

  async pinFile(file: File): Promise<PinResult> {
    const upload = await this.pinata.upload.public.file(file);
    return { cid: upload.cid };
  }

  async pinJSON(data: object): Promise<PinResult> {
    const upload = await this.pinata.upload.public.json(data);
    return { cid: upload.cid };
  }

  getGatewayUrl(cid: string): string {
    return `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`;
  }
}
