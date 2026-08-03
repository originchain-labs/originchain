import { z } from "zod";

export const nonceRequestSchema = z.object({
    walletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

export const verifyRequestSchema = z.object({
    message: z.string().min(1),
    signature: z
        .string()
        .regex(/^0x[a-fA-F0-9]+$/, "Invalid signature format"),
});