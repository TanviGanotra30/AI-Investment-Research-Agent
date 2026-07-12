const companyMap: Record<string, string> = {
    apple: "AAPL",
    tesla: "TSLA",
    microsoft: "MSFT",
    google: "GOOGL",
    amazon: "AMZN",
    nvidia: "NVDA",
    meta: "META",
    infosys: "INFY",
    tcs: "TCS.NS",
    wipro: "WIPRO.NS",
};

export function getStockSymbol(company: string) {
    return companyMap[company.toLowerCase()] || company.toUpperCase();
}