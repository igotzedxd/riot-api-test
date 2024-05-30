"use client";

import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import styles from "./accounts.module.css";
import Image from "next/image";

const Accounts = () => {
  const [accountName, setAccountName] = useState("");
  const [serverRegion, setServerRegion] = useState("");
  const [localError, setLocalError] = useState("");
  const { accounts, addAccount, selectAccount, error, setError, matchDetails, setMatchDetails } =
    useUserContext();

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(""); // Clear global error
    if (!accountName.includes("#") || !serverRegion) {
      setLocalError("Full Riot ID (accountname#tagLine) and server region are required");
      return;
    }

    const [name, tag] = accountName.split("#");
    if (!name || !tag) {
      setLocalError("Invalid Riot ID format");
      return;
    }

    await addAccount(name, tag.toUpperCase(), serverRegion);
    setAccountName("");
    setServerRegion("");
  };

  return (
    <div className={styles.accounts}>
      <h2>Accounts</h2>
      <form className={styles.addForm} onSubmit={handleAddAccount}>
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
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Enter Riot ID (accountname#tagLine)"
          required
        />
        <button type="submit">Add Account</button>
      </form>
      {(localError || error) && <p style={{ color: "red" }}>{localError || String(error)}</p>}
      <div>
        <h3>Account List</h3>
        <ul>
          {accounts &&
            accounts.map(
              (account) =>
                matchDetails &&
                matchDetails.info &&
                matchDetails.info.participants.map(
                  (participant, index) =>
                    participant.riotIdGameName === account.accountName && (
                      <Image
                        key={index}
                        src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${participant.profileIcon}.png`}
                        width={50}
                        height={50}
                        alt="profile icon"
                      />
                    )
                )
            )}
          {accounts &&
            accounts.map((account, index) => (
              <li
                key={index}
                onClick={() => selectAccount(account)}
                className={account.selected ? styles.selected : ""}
              >
                {account.accountName}#{account.tagLine} - {account.serverRegion}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
