import { connectToDatabase } from "@/lib/Database/MongoDb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        return NextResponse.json({ message: 'Connected to MongoDB' });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}