// context/userContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [summonerName, setSummonerName] = useState("");
  const [serverRegion, setServerRegion] = useState("");
  const [puuid, setPuuid] = useState("");
  const [matchData, setMatchData] = useState([]);
  const [matchDetails, setMatchDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, []);

  return (
    <UserContext.Provider
      value={{
        summonerName,
        setSummonerName,
        serverRegion,
        setServerRegion,
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
        accounts,
        setAccounts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
