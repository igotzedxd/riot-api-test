import Image from "next/image";
import styles from "./page.module.css";
import FetchPUUID from "@/components/matchHistory/matchHistory";
import Accounts from "@/components/accounts/accounts";

export default function Home() {
  return (
    <>
      <FetchPUUID />
      <Accounts />
    </>
  );
}
