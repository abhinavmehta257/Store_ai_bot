import React from 'react'

function TopEmoji({top_emojis}) {
    return (
        <div className='w-[190px] h-[242px] bg-[#ffcfcf] rounded-[8px] p-[24px]'>
            <div class="text-[#3f6e8c] text-base font-semibold font-['Inter'] leading-none">Top Emoji</div>
            <div className='grid grid-cols-2'>

            {top_emojis.map((emoji,index)=>(
                <div key={index} class="flex mt-[12px] items-center gap-[4px]">
                    <div class="text-[#3f6e8c] text-[22px] font-normal font-['Inter']">{emoji.emoji}</div>
                    <div class="text-[#3f6e8c] text-[12px] font-semibold font-['Inter']">{emoji.count}</div>
                </div>
            ))}
            </div>

        </div>
    )
}

export default TopEmoji