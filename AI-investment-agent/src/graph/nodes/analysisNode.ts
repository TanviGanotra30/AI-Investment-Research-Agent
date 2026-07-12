import { StateAnnotation } from "../state";
import { llm } from "../../lib/gemini";

export async function analysisNode(
    state: typeof StateAnnotation.State
) {

  const response = await llm.invoke(`
You are a Senior Investment Research Analyst.

Analyze the company using the provided financial data and market sentiment.

Company:
${state.company}

Financial Data:
${state.financialData}

News:
${state.news}

Instructions:

1. Evaluate:
- Financial Strength
- Growth Potential
- Market Sentiment
- Business Risks
- Long-term Outlook

2. Generate a recommendation:
- INVEST
- HOLD
- PASS

3. The output must be logically consistent.

Rules:
- If riskLevel is HIGH, explain why the investment is still worthwhile or recommend HOLD/PASS.
- If decision is INVEST, justify why the expected returns outweigh the risks.
- Confidence should reflect the quality of the available data.
- Do not generate contradictory outputs.

Before returning the response, verify:
- decision matches reasoning.
- riskLevel matches identified risks.
- confidence matches available evidence.

Return ONLY valid JSON in this exact format:

{
  "company": "",
  "decision": "INVEST | HOLD | PASS",
  "confidence": 0,
  "reasoning": "",
  "pros": [],
  "cons": [],
  "riskLevel": "LOW | MEDIUM | HIGH"
}

Do not return markdown.
Do not use triple backticks.
Return only JSON.
`);

    let text = response.content as string;

    text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return {
        recommendation: JSON.parse(text),
    };
}