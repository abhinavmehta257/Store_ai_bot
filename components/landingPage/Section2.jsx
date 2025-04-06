import React, { useEffect, useState } from 'react'
let how_to = [
  {
    "url":"/assets/img/undraw_chat-bot_44el.svg",
    "text":"Automated Call Handling",
    "content":"Manual booking errors and delays mean fewer scheduled appointments."
  },{
    "url":"/assets/img/how_train.png",
    "text":"24/7 Appointment Scheduling",
    "content":" Customers expect instant, 24/7 service; failing to deliver drives them to competitors."

  },{
    "url":"/assets/img/undraw_booking_1ztt.svg",
    "text":"Seamless CRM & Calendar Integration",
    "content":"Inefficiencies in handling inquiries result in lost sales and repeat business."

  },{
    "url":"/assets/img/how_install.png",
    "text":"Multi-Language Support",
    "content":"Extra staffing and time-consuming manual processes cut into your profits."

  }
]

function autoRotate (setSelect){
  
}

function Section2() {
  const [select, setSelect] = useState(0);

  useEffect(() => {
    const rotate = setInterval(() => {
      setSelect(prevSelect => (prevSelect >= how_to.length - 1 ? 0 : prevSelect + 1));
    }, 3000);
    return () => {
      clearInterval(rotate);
    };
  });

  function selectHowTo(index){
    setSelect(index);
  }

  return (
    <div className="bg-[url('/assets/img/how-it-works-background.png')] md:py-[64px] p-[150px] md:px-[150px] px-[32px] mt-[80px]">
      <h3 className="text-white text-[44px] font-extrabold font-['Public Sans'] leading-[52.80px] text-center">Our AI Voicebot Delivers, So You Don’t Lose Out:</h3>

      <div className='flex md:flex-row flex-col justify-center items-center mt-[64px]'>
        <div className='flex md:flex-row flex-col justify-center items-center md:gap-[64px] gap-[32px]'>
          {how_to.map((item, index) => (
            <div key={index} onClick={() => selectHowTo(index)} className={`p-4 border-2 border-[white] rounded-[16px] flex flex-col justify-center items-center cursor-pointer transition-all ${select === index ? 'opacity-100 p-8' : 'opacity-50'}`}>
              <h4 className='text-white text-center text-[20px] font-bold font-["Public Sans"] mt-[16px]'>{item.text}</h4>
              <div className='flex justify-center items-center mt-[16px] text-zinc-100 text-center'>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Section2