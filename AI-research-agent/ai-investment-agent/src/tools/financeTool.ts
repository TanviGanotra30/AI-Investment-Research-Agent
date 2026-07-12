import axios from "axios";

const API_KEY = process.env.ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export async function getCompanyProfile(symbol: string) {
    try {

        const { data } = await axios.get(BASE_URL, {
            params: {
                function: "OVERVIEW",
                symbol: symbol.toUpperCase(),
                apikey: API_KEY,
            },
        });

        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}