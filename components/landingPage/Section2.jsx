import React from 'react'

function Section2() {
  return (
    <div className="bg-[url('/assets/img/how-it-works-background.png')] py-[184px] px-[92px] mt-[-80px]">
        <div className='flex'>
            <div className='md:w-[50%]'>
                <div className="text-white text-[44px] font-extrabold font-['Public Sans'] leading-[52.80px]">How it works</div>
                <div className="pt-[32px]">
                <div className="opacity-50 text-white">1{"  "}Create and customize your AI chatbot in 3 steps</div>
                <div className="pt-[24px] underline underline-offset-4 text-white">2{"  "}Train your chatbot by scanning or uploading knowledge.</div>
                <div className="pt-[24px] opacity-50 text-white">3{"  "}Embed your chatbot to your site.</div>
                </div>
            </div>
            <div className='md:w-[50%]'>
                <img src="/assets/img/how_create.svg" alt="" />
                <img src="/assets/img/how_train.png" alt="" />
                <img src="/assets/img/how_install.svg" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Section2