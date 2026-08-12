import { z } from "zod";

export const createCreatorSchema = z.object({
    displayName: z.string().min(1).max(100),
    bio: z.string().max(500).optional(),
});

export const updateCreatorSchema = createCreatorSchema.partial();