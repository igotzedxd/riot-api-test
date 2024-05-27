"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import styles from "./accounts.module.css";

const regionMapping = {
  EUW: { platform: "euw1", region: "europe" },
  NA: { platform: "na1", region: "americas" },
  EUNE: { platform: "eun1", region: "europe" },
  KR: { platform: "kr", region: "asia" },
  // Add other mappings as needed
};

const Accounts = () => {
  const [accountName, setAccountName] = useState("");
  const [serverRegion, setServerRegion] = useState("");
  const [error, setError] = useState("");
  const {
    accounts,
    setAccounts,
    setSummonerName,
    setServerRegion: setContextServerRegion,
  } = useUserContext();

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, [setAccounts]);

  const handleAddAccount = (e) => {
    e.preventDefault();
    setError("");

    if (!accountName || !serverRegion) {
      setError("Account name and server region are required");
      return;
    }

    const region = regionMapping[serverRegion.toUpperCase()];
    if (!region) {
      setError("Invalid server region");
      return;
    }

    const newAccount = { accountName, serverRegion: region.platform };
    let storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];

    if (
      storedAccounts.some(
        (acc) => acc.accountName === accountName && acc.serverRegion === region.platform
      )
    ) {
      setError("Account already exists in local storage");
      return;
    }

    storedAccounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(storedAccounts));
    setAccounts([...storedAccounts]);
    setAccountName("");
    setServerRegion("");
  };

  const handleSelectAccount = (account) => {
    setSummonerName(account.accountName);
    setContextServerRegion(account.serverRegion);
  };

  return (
    <div className={styles.accounts}>
      <h2>Accounts</h2>
      <form className={styles.addForm} onSubmit={handleAddAccount}>
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter Account Name"
          required
        />
        <select value={serverRegion} onChange={(e) => setServerRegion(e.target.value)} required>
          <option value="" disabled>
            Select Server Region
          </option>
          <option value="EUW">EUW</option>
          <option value="NA">NA</option>
          <option value="EUNE">EUNE</option>
          <option value="KR">KR</option>
          {/* Add other regions as needed */}
        </select>
        <button type="submit">Add Account</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h3>Account List</h3>
        <ul>
          {accounts &&
            accounts.map((account, index) => (
              <li key={index} onClick={() => handleSelectAccount(account)}>
                {account.accountName} - {account.serverRegion}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
