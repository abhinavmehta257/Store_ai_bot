import Head from "next/head";
import styles from "../styles/Home.module.css";
import Nav from "../components/Nav";
import Section1 from "../components/landingPage/Section1";
import Section2 from "../components/landingPage/Section2";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="pt-[104px] md:px-[96px] px-[32px]">
        <Section1 />
      </div>
      <Section2 />

    </>
  );
}
