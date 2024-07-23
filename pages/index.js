import Head from "next/head";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Section1 from "../components/landingPage/Section1";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="pt-[104px]">
        <Section1 />
      </div>
    </>
  );
}
