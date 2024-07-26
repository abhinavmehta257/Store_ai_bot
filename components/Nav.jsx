import React from "react";

function Nav() {
  return (
    <div className="w-full h-[76px] px-[96px] bg-white shadow justify-center items-center inline-flex">
      <div className="w-full h-[76px] flex-row justify-between items-center flex">
        <div className="pb-1 justify-start items-center  gap-3 inline-flex">
          <img
            className="w-[50px] h-[50px] rounded-[151.50px]"
            src="/assets/img/logo/logo_sq.png"
          />
          <div className="w-[129.97px] h-9 text-[#161616] text-2xl font-bold font-['Quicksand'] underline leading-9">
            Brainybear
          </div>
        </div>
        <div className="hidden md:flex">
          <div className="px-[64px] pb-0.5 justify-end items-start gap-[50.45px] inline-flex">
            <div className="w-[61.02px] h-6 justify-center items-center inline-flex">
              <div className="w-[61.41px] h-6 text-black text-base font-bold font-['Quicksand'] leading-normal">
                Contact
              </div>
            </div>
            <div className="w-[42.50px] h-6 justify-center items-center inline-flex">
              <div className="w-[42.83px] h-6 text-black text-base font-bold font-['Quicksand'] leading-normal">
                Login
              </div>
            </div>
          </div>
          <button className="w-[150px] h-9 pl-[25.78px] pr-[25.43px] py-1.5 bg-[#264653] rounded-md text-white text-sm font-bold font-['Quicksand'] leading-normal tracking-wide">
              Start for free
          </button>
        </div>
      </div>
    </div>
  );
}

export default Nav;
