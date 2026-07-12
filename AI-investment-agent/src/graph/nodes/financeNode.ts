import { StateAnnotation } from "../state";
import { getCompanyProfile } from "../../tools/financeTool";
import { getStockSymbol } from "../../utils/symbolMapper";


export async function financeNode(
    state: typeof StateAnnotation.State
) {

    const symbol = getStockSymbol(state.company);
    const profile = await getCompanyProfile(symbol);

    if (!profile || profile.Note || profile.Information) {
        return {
            financialData: "Financial data not available.",
        };
    }

    return {
        financialData: `
Company: ${profile.Name}
Sector: ${profile.Sector}
Industry: ${profile.Industry}
Market Capitalization: ${profile.MarketCapitalization}
PERatio: ${profile.PERatio}
EPS: ${profile.EPS}
Profit Margin: ${profile.ProfitMargin}
Dividend Yield: ${profile.DividendYield}
52 Week High: ${profile["52WeekHigh"]}
52 Week Low: ${profile["52WeekLow"]}
Description: ${profile.Description}
`,
    };
}