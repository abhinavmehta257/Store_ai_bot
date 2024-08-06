import {PageTop, PageBottom, PageBreak} from "@fileforge/react-print";
import * as React from "react";
import DaysChart from "./documentComponents/DaysChart";
import TopWords from "./documentComponents/TopWords";
import MessageCount from "./documentComponents/MessageCount";
import TopEmoji from "./documentComponents/TopEmoji";
const data = {
    "users": {
        "user_1": "Joe",
        "user_2": "Jean"
    },
    "message_count": {
        "user_1": {
            "count": 2535,
            "percentage": "45.30"
        },
        "user_2": {
            "count": 3061,
            "percentage": "54.70"
        }
    },
    "top_emoji": [
        {
            "emoji": "😤",
            "count": 758
        }, {
            "emoji": "😁",
            "count": 634
        }, {
            "emoji": "😅",
            "count": 256
        }, {
            "emoji": "😒",
            "count": 228
        }, {
            "emoji": "️🐀",
            "count": 175
        }, {
            "emoji": "😂",
            "count": 112
        }, {
            "emoji": "💘",
            "count": 110
        }, {
            "emoji": "😭",
            "count": 83
        }, {
            "emoji": "🤑",
            "count": 60
        }, {
            "emoji": "😔",
            "count": 54
        }
    ],
    "days": [
        {
            value: 1132,
            name: 'Monday'
        }, {
            value: 588,
            name: 'Tuesday'
        }, {
            value: 1218,
            name: 'Wednesday'
        }, {
            value: 435,
            name: 'Thursday'
        }, {
            value: 946,
            name: 'Friday'
        }, {
            value: 610,
            name: 'Saturday'
        }, {
            value: 667,
            name: 'Sunday'
        }
    ],
    "top_words": [
        {
            "word": "hai",
            "count": 715
        }, {
            "word": "nhi",
            "count": 624
        }, {
            "word": "rha",
            "count": 394
        }, {
            "word": "kya",
            "count": 388
        }, {
            "word": "toh",
            "count": 349
        }, {
            "word": "🤣🤣",
            "count": 343
        }, {
            "word": "bhi",
            "count": 342
        }, {
            "word": "you",
            "count": 333
        }, {
            "word": "mai",
            "count": 276
        }, {
            "word": "and",
            "count": 271
        }
    ],
    "time": [
        672,
        218,
        60,
        0,
        5,
        0,
        0,
        0,
        69,
        49,
        71,
        167,
        105,
        233,
        385,
        195,
        236,
        203,
        257,
        360,
        399,
        441,
        596,
        875
    ],
    "you_said": {
        "word": "lob you",
        "count": 23
    },
    "start_date": "2024-07-03",
    "end_date": "2024-07-29",
    "first_text": {
        "sender": "Abhinav Mehta",
        "timestamp": "7/4/24 14:43",
        "message": "Hello miss 🥰"
    },
    "last_text": {
        "sender": "Abhinav Mehta",
        "timestamp": "7/30/24 18:53",
        "message": "Bana paigi design ??"
    },
    "laugh_count": 390
}

export const Document = () => {
    console.log(data);

    return (
        <div className="p-[24px] w-[842px] h-[1190px] leading-none">
            <div class="text-black text-[24px] font-normal font-['Inter']">
                {data
                    .users
                    .user_1
                    .split(" ")[0]}
                and {data
                    .users
                    .user_2
                    .split(" ")[0]}
            </div>
            <div class="text-black text-[18px] font-normal font-['Inter'] pt-[8px] tracking-wider">
                {data.first_text.timestamp}
                to {data.last_text.timestamp}
            </div>
            <div className="">
                {/* row 1 */}
                <div className="inline-flex gap-[16px]">
                    <MessageCount data={data}/>
                    <DaysChart data={data.days}/>
                </div>

                {/* row2 */}
                <div className="inline-flex gap-[16px] mt-[16px]">
                    <TopWords
                        top_words={data
                        .top_words
                        .splice(0, 8)}/>
                    <TopWords
                        top_words={data
                        .top_words
                        .splice(0, 8)}/>
                    <TopEmoji top_emojis={data.top_emoji}/>
                </div>

                {/* row 3 */}
                <div className="inline-flex gap-[16px] mt-[16px]">
                  <div class="w-[492px] h-[242px] bg-[#d9d9d9] rounded-[8px]"></div>
                  <div class="w-[286px] h-[242px] bg-[#d9d9d9] rounded-[8px]"></div>
                </div>

                {/* row 4 */}
                <div className="inline-flex gap-[16px] mt-[16px]">
                  <div class="w-[286px] h-[242px] bg-[#d9d9d9] rounded-[8px]"></div>
                  <div class="w-[190px] h-[242px] bg-[#d9d9d9] rounded-[8px]"></div>
                  <div class="w-[286px] h-[242px] bg-[#d9d9d9] rounded-[8px]"></div>
                </div>
            </div>
        </div>
    );
};