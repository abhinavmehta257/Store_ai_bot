import React from 'react'

function Section3() {
    return (
        <div className='md:p-[120px] p-[32px] flex md:flex-row flex-col gap-[48px]'>
            <div className='md:py-[56px] md:px-[48px] bg-[#F6F6F7] rounded-[24px] p-[32px]'>
                <div
                    className="text-[#2b2b2b] text-[38px] font-extrabold font-['Public Sans'] leading-[41.80px]">Traditional Chatbots</div>
                <ul className='list-disc text-[#2b2b2b] mt-[36px] flex flex-col gap-[16px]'>
                    <li>
                        <b>Text-Based Only:</b> Requires users to type out responses, which can be slower and less natural.
                    </li>
                    <li>
                        <b>Limited Accessibility:</b> Not ideal for visually impaired or multitasking users.
                    </li>
                    <li>
                        <b>Less Personal Experience:</b> Feels more like filling out a form than having a conversation.
                    </li>
                    <li>
                        <b>Can Be Slower in Response:</b> Often requires multiple back-and-forth messages to get the full context.
                    </li>
                    <li>
                        <b>Harder to Use on the Go:</b> Typing while moving or driving isn't always safe or practical.
                    </li>
                    <li>
                        <b>Less Human-Like:</b> Lacks tone, emotion, and natural pauses that come with real voice conversation.
                    </li>
                </ul>
            </div>
            <div className='md:py-[56px] md:px-[48px] bg-[#264653] rounded-[24px] p-[32px]'>
                <div
                    className="text-white text-[38px] font-extrabold font-['Public Sans'] leading-[41.80px]">WiseOwl Voicebots</div>
                <ul className='list-disc text-white mt-[36px] flex flex-col gap-[16px]'>
                    <li>
                        <b>Natural Voice Interaction:</b> Lets users speak freely, just like talking to a real person.
                    </li>
                    <li>
                        <b>Hands-Free Convenience:</b> Perfect for multitasking, driving, or accessibility needs.
                    </li>
                    <li>
                        <b>Faster Resolutions:</b> Can process and respond to queries more fluidly than text-based flows.
                    </li>
                    <li>
                        <b>Emotionally Engaging:</b> Uses tone and inflection to create more relatable, human-like interactions.
                    </li>
                    <li>
                        <b>Context-Aware Conversations:</b> Understands user intent even when phrased differently.
                    </li>
                    <li>
                        <b>Multi-Language Ready:</b> Supports global audiences with real-time translation and localization.
                    </li>
                    <li>
                        <b>Always On, Always Listening:</b> Ready to jump into a conversation without typing or searching.
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Section3
