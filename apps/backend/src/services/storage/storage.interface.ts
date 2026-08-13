export interface PinResult {
  cid: string;
}

export interface StorageService {
  pinFile(file: File): Promise<PinResult>;
  pinJSON(data: object): Promise<PinResult>;
  getGatewayUrl(cid: string): string;
}
