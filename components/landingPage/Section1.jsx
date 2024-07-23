import React from "react";

function Section1() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full text-center text-[#161616] text-[70px] font-extrabold font-['Public Sans'] leading-[84px]">
        Train AI Chatbots in 3 Clicks.
        <br />
        Help Customers Instantly.
      </div>
      <div className="pt-[24px] pb-[0.58px] justify-center items-center inline-flex">
        <div className="text-center">
          <span className="text-[#282828] text-2xl font-normal font-['Karla'] leading-loose">
            Build AI Chatbots in
          </span>
          <span className="text-[#282828] text-2xl font-normal font-['Karla'] leading-loose">
            and Train in
          </span>{" "}
          <span className="text-[#282828] text-2xl font-normal font-['Karla'] underline leading-loose">
            3 Clicks
          </span>
          <span className="text-[#282828] text-2xl font-normal font-['Karla'] leading-loose">
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
    </div>
  );
}

export default Section1;
