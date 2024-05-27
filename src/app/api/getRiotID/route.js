import axios from "axios";
import { NextResponse } from "next/server";

const API_KEY = process.env.RIOT_API_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");

  console.log("API hit with method:", request.method); // Debugging log
  console.log("PUUID:", puuid); // Debugging log

  if (!puuid) {
    return NextResponse.json({ error: "PUUID is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: {
          "X-Riot-Token": API_KEY,
          "User-Agent": "MyApp (your-email@example.com)", // Replace with your email
        },
      }
    );

    console.log("API response data:", response.data); // Debugging log

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching Riot ID:", error.response?.data || error.message); // Detailed debugging log
    if (error.response) {
      console.error("Status code:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return NextResponse.json(
      { error: error.response?.data || error.message || "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
