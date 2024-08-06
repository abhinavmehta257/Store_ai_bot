import React from 'react'

function TopWords({top_words}) {
    console.log(top_words);

    return (
        <div class="w-[286px] h-[242px] bg-[#FFCFCF] rounded-[8px] p-[24px]">
            <div class="text-[#3f6e8c] text-base font-semibold font-['Inter'] leading-none">Top Words</div>
            <div className="grid grid-cols-2 mt-[4px]">
                {top_words.map((top_word, index) => (
                    <div key={index} className="flex flex-col gap-[2px] mt-[8px]">
                        <span
                            className=" text-[#3f6e8c] text-[18px] font-bold font-['Inter'] leading-none capitalize">{top_word.word}</span>
                        <span
                            className="text-[#3f6e8c] text-[14px] font-normal font-['Inter'] leading-none">{top_word.count}</span>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default TopWords