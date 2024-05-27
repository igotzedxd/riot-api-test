"use client";

import { useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import styles from "./matchHistory.module.css";

const FetchPUUID = () => {
  const {
    summonerName,
    serverRegion,
    puuid,
    setPuuid,
    matchData,
    setMatchData,
    matchDetails,
    setMatchDetails,
    error,
    setError,
    loading,
    setLoading,
  } = useUserContext();

  useEffect(() => {
    if (summonerName && serverRegion) {
      fetchPuuid(summonerName, serverRegion);
    }
  }, [summonerName, serverRegion]);

  const fetchPuuid = async (summonerName, serverRegion) => {
    setLoading(true);
    try {
      console.log("Fetching PUUID with Summoner Name:", summonerName);
      console.log("Using Platform Region:", serverRegion);

      const response = await fetch(
        `/api/getPuuid?summonerName=${encodeURIComponent(
          summonerName
        )}&platformRegion=${encodeURIComponent(serverRegion)}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log("Received PUUID:", data.puuid);
        setPuuid(data.puuid);
        fetchMatchData(data.puuid, serverRegion);
      } else {
        console.error("Error fetching PUUID:", data.error);
        setError(data.error);
      }
    } catch (err) {
      console.error("Error in fetchPuuid:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchData = async (puuid, region) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getMatchData?puuid=${puuid}&region=${region}`);
      const data = await response.json();

      if (response.ok) {
        setMatchData(data.matchData);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchDetails = async (matchId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getMatchDetails?matchId=${matchId}`);
      const data = await response.json();

      if (response.ok) {
        setMatchDetails(data.matchDetails);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.matchHistory}>
      <h1>League of Legends Data Fetcher</h1>
      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "red" }}>{typeof error === "object" ? JSON.stringify(error) : error}</p>
      )}
      {puuid && <p>PUUID: {puuid}</p>}
      {matchData.length > 0 && (
        <div>
          <h2>Match Data</h2>
          <ul>
            {matchData.map((matchId) => (
              <li key={matchId}>
                {matchId}
                <button onClick={() => fetchMatchDetails(matchId)}>View Details</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {matchDetails && matchDetails.info && (
        <div>
          <h2>Match Details</h2>
          <ul>
            {matchDetails.info.participants.map((participant, index) => (
              <li key={index}>{participant.riotIdGameName}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FetchPUUID;
