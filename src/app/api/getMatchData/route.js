import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid");
  const region = "europe"; // Regional routing value for match-v5
  const apiKey = process.env.RIOT_API_KEY;

  if (!puuid) {
    return new Response(JSON.stringify({ error: "PUUID is required" }), { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: {
          "X-Riot-Token": apiKey,
          "User-Agent": "MyApp (your-email@example.com)", // Replace with your email
        },
        params: {
          start: 0,
          count: 20,
        },
      }
    );

    const matchHistory = response.data;
    return new Response(JSON.stringify({ matchHistory }), { status: 200 });
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message); // Log error response
    return new Response(JSON.stringify({ error: error.response?.data || error.message }), {
      status: error.response?.status || 500,
    });
  }
}
