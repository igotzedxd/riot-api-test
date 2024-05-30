"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [summonerName, setSummonerName] = useState("");
  const [serverRegion, setServerRegion] = useState("");
  const [puuid, setPuuid] = useState("");
  const [riotId, setRiotId] = useState("");
  const [matchData, setMatchData] = useState([]);
  const [matchDetails, setMatchDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);

    const handleStorageChange = () => {
      const updatedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
      setAccounts(updatedAccounts);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const fetchPuuid = async (accountName, tagLine, serverRegion) => {
    try {
      const response = await fetch(
        `/api/getPuuid?accountName=${encodeURIComponent(accountName)}&tagLine=${encodeURIComponent(
          tagLine
        )}&platformRegion=${encodeURIComponent(serverRegion)}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log("Fetched PUUID:", data.puuid);
        return data.puuid;
      } else {
        const errorMessage = data.error || "Failed to fetch PUUID";
        console.error("fetchPuuid error:", errorMessage);
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("fetchPuuid error:", errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  const addAccount = async (accountName, tagLine, serverRegion) => {
    const regionMapping = {
      EUW: { platform: "euw1", region: "europe" },
      NA: { platform: "na1", region: "americas" },
      EUNE: { platform: "eun1", region: "europe" },
      KR: { platform: "kr", region: "asia" },
      // Add other mappings as needed
    };

    const region = regionMapping[serverRegion.toUpperCase()];
    if (!region) {
      const errorMessage = "Invalid platform region";
      console.error("addAccount error:", errorMessage);
      setError(errorMessage);
      return;
    }

    const upperCaseTagLine = tagLine.toUpperCase();

    const puuid = await fetchPuuid(accountName, upperCaseTagLine, region.platform);
    if (!puuid) return;

    const newAccount = {
      accountName: puuid.gameName,
      tagLine: upperCaseTagLine,
      serverRegion: region.platform,
      puuid: puuid.puuid,
      selected: false,
    };

    console.log("hehe", puuid.puuid);

    let storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];

    if (
      storedAccounts.some(
        (acc) =>
          acc.accountName === accountName &&
          acc.tagLine === upperCaseTagLine &&
          acc.serverRegion === region.platform
      )
    ) {
      const errorMessage = "Account already exists in local storage";
      console.error("addAccount error:", errorMessage);
      setError(errorMessage);
      return;
    }

    if (storedAccounts.length === 0) {
      newAccount.selected = true;
    }

    storedAccounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(storedAccounts));
    setAccounts([...storedAccounts]);
    console.log("Account added successfully:", newAccount);
  };

  const selectAccount = (selectedAccount) => {
    console.log("Selecting account:", selectedAccount);
    setSummonerName(`${selectedAccount.accountName}#${selectedAccount.tagLine}`);
    setServerRegion(selectedAccount.serverRegion);
    setPuuid(selectedAccount.puuid);

    const updatedAccounts = accounts.map((account) =>
      account.accountName === selectedAccount.accountName &&
      account.tagLine === selectedAccount.tagLine &&
      account.serverRegion === selectedAccount.serverRegion
        ? { ...account, selected: true }
        : { ...account, selected: false }
    );

    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
  };

  const fetchMatchData = async (puuid, region) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/getMatchData?puuid=${puuid}&region=${region}`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setMatchData(data.matchHistory);
      } else {
        const errorMessage = data.error || "Failed to fetch match data";
        console.error("fetchMatchData error:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("fetchMatchData error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchDetails = async (matchId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/getMatchDetails?matchId=${matchId}`);
      const data = await response.json();

      if (response.ok) {
        setMatchDetails(data.matchDetails);
        console.log("Fetched match details:", data.matchDetails);
      } else {
        const errorMessage = data.error || "Failed to fetch match details";
        console.error("fetchMatchDetails error:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("fetchMatchDetails error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (puuid && serverRegion) {
      fetchMatchData(puuid, serverRegion);
    }
  }, [puuid, serverRegion]);

  return (
    <UserContext.Provider
      value={{
        summonerName,
        setSummonerName,
        serverRegion,
        setServerRegion,
        puuid,
        setPuuid,
        riotId,
        setRiotId,
        matchData,
        setMatchData,
        matchDetails,
        setMatchDetails,
        error: error ? String(error) : "",
        setError,
        loading,
        setLoading,
        accounts,
        setAccounts,
        addAccount,
        selectAccount,
        fetchMatchDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
