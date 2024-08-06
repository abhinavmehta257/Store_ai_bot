import React from 'react'

function Section4() {
    return (
        <div className='flex flex-col md:items-center md:p-[120px] p-[32px]'>
            <div
                class="md:w-[80%] md:text-center text-left text-[#161616] text-[28px] md:text-[70px] font-extrabold font-['Public Sans'] md:leading-[84px]">Direct integrations with your favorite tools</div>
            <div className='md:w-[80%] text-[24px] mt-[32px] md:text-center text-left'>
                With configurable integrations into platforms like  Facebook Messenger and WhatsApp , our chatbot becomes a flexible extension of your existing toolkit.
            </div>
            <div className='pt-[32px]'>
                <img src="/assets/img/integrations.png" alt="" />
            </div>
        </div>  
    )
}

export default Section4