import { investmentGraph } from "../graph/investmentGraph";

export async function investmentService(company: string) {

    const result = await investmentGraph.invoke({
        company,
    });

    console.log(result);

    return result.recommendation;
}