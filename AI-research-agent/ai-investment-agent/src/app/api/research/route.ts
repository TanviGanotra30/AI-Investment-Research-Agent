import { NextResponse } from "next/server";
import { investmentService } from "@/src/services/investmentService";

export async function POST(request: Request) {

    try {

        const body = await request.json();

        const { company } = body;

        const result = await investmentService(company);

        return NextResponse.json(result);

    } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
        {
            message: "Internal Server Error",
            error: String(error),
        },
        {
            status: 500,
        }
    );
}

}