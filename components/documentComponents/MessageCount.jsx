import React from 'react'

function MessageCount({data}) {
    return (
        <div
            className="w-[286px] h-[242px] bg-[#E4EBF3] rounded-[8px] mt-[32px] p-[24px]">
            <span class="text-[#3f6e8c] font-semibold font-['Inter']">Message count</span>
            <div className="mt-[16px]">
                <span class="text-[#3f6e8c] text-[24px] font-semibold font-['Inter']">{data
                        .users
                        .user_1
                        .split(" ")[0]}</span>
                <div
                    className="mt-[8px] p-[8px] bg-[#f2c2c2] rounded-[4px] text-[#3f6e8c] text-[24px] font-extrabold font-['Inter'] leading-none">{data.message_count.user_1.count}
                    <span className="ml-[8px] text-[16px] font-semiboald">{Math.floor(data.message_count.user_1.percentage)}%</span>
                </div>
            </div>
            <div className="mt-[8px]">
                <span class="text-[#3f6e8c] text-[24px] font-semibold font-['Inter']">{data
                        .users
                        .user_2
                        .split(" ")[0]}</span>
                <div
                    className=" mt-[8px] p-[8px] bg-[#3BBCD9] rounded-[4px] text-[#ffffff] text-[24px] font-extrabold font-['Inter'] leading-none">{data.message_count.user_2.count}
                    <span className="text-[16px] font-semiboald">{Math.floor(data.message_count.user_2.percentage)}%</span>
                </div>
            </div>
        </div>
    )
}

export default MessageCount