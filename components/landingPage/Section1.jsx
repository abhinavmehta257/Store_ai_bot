import React from "react";

function Section1() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full md:text-center text-[#161616] md:text-[64px] text-[28px] font-extrabold font-['Public Sans']">
        Train AI Chatbots in 3 Clicks.
        <br />
        Help Customers Instantly.
      </div>
      <div className="pt-[24px] pb-[0.58px] justify-center items-center inline-flex">
        <div className="md:text-center text-[#282828] md:text-2xl text-[18px] font-normal font-['Karla'] md:leading-loose">
          <span className="">
            Build AI Chatbots in
          </span>
          <span className="">
            and Train in
          </span>{" "}
          <span className="underline ">
            3 Clicks
          </span>
          <span className="">
            . Brainybear scans your website or
            <br />
            uploaded files to deliver quick, accurate AI answers to customer
            queries.
          </span>
        </div>
      </div>
      <button className="mt-[36px] w-[164px] py-3 bg-[#264653] rounded-md text-white text-base font-bold font-['Quicksand']">
        Start for free
      </button>
      <div className="w-full md:px-[96px] md:text-center pt-[32px]">
        To ensure the best experience, we're onboarding only 500 new users each month.
        The first 500 users to sign up receive 100 message credits worth $10. Secure your spot now!
      </div>
      <div className="w-full text-center pt-[32px]">
      No credit card required. Base plan free for life.
      </div>
      <div>
        <img src="/assets/img/demoscreen.png" alt="" />
      </div>
    </div>
  );
}

export default Section1;
