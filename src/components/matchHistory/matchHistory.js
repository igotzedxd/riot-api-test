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
    riotId,
    setRiotId,
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

  useEffect(() => {
    if (puuid) {
      fetchRiotId(puuid);
    }
  }, [puuid]);

  const fetchPuuid = async (summonerName, serverRegion) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/getPuuid?summonerName=${encodeURIComponent(
          summonerName
        )}&platformRegion=${encodeURIComponent(serverRegion)}`
      );
      const data = await response.json();

      if (response.ok) {
        setPuuid(data.puuid);
        fetchMatchData(data.puuid, serverRegion);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiotId = async (puuid) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/getRiotID?puuid=${puuid}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRiotId(data.gameName);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchData = async (puuid, region) => {
    setLoading(true);
    setError(null);
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
    setError(null);
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
      {riotId}
      {matchData.length > 0 && (
        <div>
          <h2>Match Data</h2>
          <div className={styles.matchesContainer}>
            {matchData.map((matchId) => (
              <div key={matchId} onClick={() => fetchMatchDetails(matchId)}>
                {matchId}
              </div>
            ))}
          </div>
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
