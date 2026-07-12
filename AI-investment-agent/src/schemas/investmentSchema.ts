import { z } from "zod";

export const investmentSchema = z.object({
    company: z.string(),

    decision: z.enum([
        "INVEST",
        "HOLD",
        "PASS",
    ]),

    confidence: z.number(),

    reasoning: z.string(),

    pros: z.array(z.string()),

    cons: z.array(z.string()),

    riskLevel: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),
});

export type InvestmentReport =
    z.infer<typeof investmentSchema>;