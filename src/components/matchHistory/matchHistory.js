"use client";

import { useUserContext } from "@/context/userContext";
import styles from "./matchHistory.module.css";
import Image from "next/image";

const MatchHistory = () => {
  const { riotId, matchData, matchDetails, fetchMatchDetails, error } = useUserContext();

  return (
    <div className={styles.matchHistory}>
      {riotId}
      {error && <p style={{ color: "red" }}>{String(error)}</p>}
      <h2>Match Data</h2>
      {matchData.length > 0 && (
        <div>
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
              <div key={index}>
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${participant.profileIcon}.png`}
                  width={50}
                  height={50}
                  alt="champion"
                />{" "}
                <span>{participant.riotIdGameName}</span>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchHistory;
