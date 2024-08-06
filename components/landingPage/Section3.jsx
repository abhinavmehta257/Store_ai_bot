import React from 'react'

function Section3() {

    return (
        <div className='md:p-[120px] p-[32px] flex md:flex-row flex-col gap-[48px]'>
            <div className='md:py-[56px] md:px-[48px] bg-[#F6F6F7] rounded-[24px] p-[32px]'>
                <div
                    className="text-[#2b2b2b] text-[38px] font-extrabold font-['Public Sans'] leading-[41.80px]">Traditional<br/>Flow-Based Chatbots</div>
                <ul className='list-disc text-[#2b2b2b] mt-[36px] flex flex-col gap-[16px]'>
                    <li>
                        <b>Time-Consuming Setup:</b>
                        Takes time to set up the flow and train, which can delay getting started.
                    </li>
                    <li>
                      <b>Can’t Go Off-Script:</b> Understands and responds just like a person would, making conversations feel natural and easy.
                    </li>
                    <li>
                      <b>Doesn’t Get the Full Picture:</b> Ready for anything you throw at it, no matter how unexpected.
                    </li>
                    <li>
                      <b>Can’t Learn New Tricks:</b> : Learns from each chat, becoming better and more helpful with every conversation.
                    </li>
                    <li>
                      <b>Needs Regular Updates:</b> : Once set up, it takes care of itself, needing fewer check-ins or tweaks from you.
                    </li>
                    <li>
                      <b>Might Feel Robotic:</b> : Makes sure people enjoy chatting, helping them stick around longer and feel more satisfied.
                    </li>
                </ul>
            </div>
            <div className='md:py-[56px] md:px-[48px] bg-[#264653] rounded-[24px] p-[32px]'>
                <div
                    className="text-white text-[38px] font-extrabold font-['Public Sans'] leading-[41.80px]">WiseOwl<br/>GPT-based AI Chatbots</div>
                <ul className='list-disc text-white mt-[36px] flex flex-col gap-[16px]'>
                    <li>
                        <b>Time-Consuming Setup:</b>
                        Takes time to set up the flow and train, which can delay getting started.
                    </li>
                    <li>
                      <b>Talks Like a Human:</b> Understands and responds just like a person would, making conversations feel natural and easy.
                    </li>
                    <li>
                      <b>Handles Any Question:</b> Ready for anything you throw at it, no matter how unexpected.
                    </li>
                    <li>
                      <b>Gets Smarter Over Time:</b> : Learns from each chat, becoming better and more helpful with every conversation.
                    </li>
                    <li>
                      <b>Less Work for You:</b> : Once set up, it takes care of itself, needing fewer check-ins or tweaks from you.
                    </li>
                    <li>
                      <b>Keeps Users Happy:</b> : Makes sure people enjoy chatting, helping them stick around longer and feel more satisfied.
                    </li>
                    <li>
                      <b>Fits Right In:</b> : Works great in all kinds of settings, from customer help desks to fun chats on social apps.
                    </li>
                    <li>
                      <b>Multilingual Support:</b> : Understands and supports over 80 languages, making it perfect for global reach.
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Section3