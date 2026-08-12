import { PinataProvider } from "./providers/pinata.provider.js";
import type { StorageService } from "./storage.interface.js";

export const storageService: StorageService = new PinataProvider();
export type { StorageService, PinResult } from "./storage.interface.js";
