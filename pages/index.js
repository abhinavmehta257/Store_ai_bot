import { Document } from "../components/Document";
import Nav from "../components/Nav";
import Section1 from "../components/landingPage/Section1";
import Section2 from "../components/landingPage/Section2";
import Section3 from "../components/landingPage/Section3";
import Section4 from "../components/landingPage/Section4";
import Section5 from "../components/landingPage/Section5";

export default function Home() {


  return (
    <>
      <Nav />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <div className="h-[700px] flex items-center" style={{background:"url('/assets/img/Background (1).png')"}}>
        <Section5 />
      </div>
      {/* <Document/> */}
    </>
  );
}

