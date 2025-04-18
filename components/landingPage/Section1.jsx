import React from "react";

function Section1() {
  return (
    <div className="flex flex-col items-center pt-[64px] md:px-[96px] px-[32px]">
      <div className="w-full md:text-center text-[#161616] md:text-[56px] text-[28px] font-extrabold font-['Public Sans']">
      Don't Let Missed Calls 
        <br />
        Cost You Revenue!
      </div>
      <div className=" pb-[0.58px] justify-center items-center inline-flex">
        <div className="md:text-center text-[#282828] md:text-2xl text-[18px] font-normal font-['Karla'] md:leading-loose">
          <span className="">
          Imagine losing potential appointments, frustrated customers, 
          </span>
          <span className="">
          and wasted time—every time a call goes unanswered.
          </span>
          <br />
          <span className="underline">
          Our AI Voicebot ensures you never miss a lead again.
          </span>
        </div>
      </div>
      <button onClick={()=>{ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);}} className="mt-[36px] w-[164px] py-3 bg-[#264653] rounded-md text-white text-base font-bold font-['Quicksand']">
        Book a free demo
      </button>
      {/* <div className="w-full md:px-[96px] md:text-center pt-[32px]">
        To ensure the best experience, we're onboarding only 500 new users each month.
        The first 500 users to sign up receive 100 message credits worth $10. Secure your spot now!
      </div>
      <div className="w-full text-center pt-[32px]">
      No credit card required. Base plan free for life.
      </div> */}
      {/* <div>
        <img src="/assets/img/demoscreen.png" alt="" />
      </div> */}
    </div>
  );
}

export default Section1;
