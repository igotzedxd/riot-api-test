import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const summonerName = searchParams.get("summonerName");
  const platformRegion = searchParams.get("platformRegion"); // e.g., euw1, na1
  const apiKey = process.env.RIOT_API_KEY;

  console.log("RIOT_API_KEY:", apiKey); // Log API key
  console.log("Summoner Name:", summonerName); // Log summoner name
  console.log("Platform Region:", platformRegion); // Log platform region

  if (!summonerName || !platformRegion) {
    return new Response(
      JSON.stringify({ error: "Summoner name and platform region are required" }),
      { status: 400 }
    );
  }

  const regionalMapping = {
    euw1: "europe",
    eun1: "europe",
    na1: "americas",
    kr: "asia",
    // Add other mappings as needed
  };

  const regionalRegion = regionalMapping[platformRegion];
  if (!regionalRegion) {
    return new Response(JSON.stringify({ error: "Invalid platform region" }), { status: 400 });
  }

  try {
    const accountApiUrl = `https://${regionalRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${platformRegion}`;
    console.log("Constructed Account API URL:", accountApiUrl);

    const accountResponse = await axios.get(accountApiUrl, {
      headers: {
        "X-Riot-Token": apiKey,
        "User-Agent": "MyApp (your-email@example.com)", // Replace with your email
      },
    });

    console.log("Account API Response Data:", accountResponse.data); // Log response data
    const puuid = accountResponse.data.puuid;
    console.log(puuid);
    return new Response(JSON.stringify({ puuid }), { status: 200 });
  } catch (error) {
    console.error("Error Response:", error.response?.data || error.message); // Log error response
    return new Response(JSON.stringify({ error: error.response?.data || error.message }), {
      status: error.response?.status || 500,
    });
  }
}
