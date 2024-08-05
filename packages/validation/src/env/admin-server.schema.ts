import { z } from "zod";

export const adminServerSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().default(3000),
});

export type AdminServerEnv = z.infer<typeof adminServerSchema>;
