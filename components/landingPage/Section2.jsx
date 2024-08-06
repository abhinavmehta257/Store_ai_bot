import React, { useState } from 'react'
let how_to = [
  {
    "url":"/assets/img/how_create.svg",
    "text":"1 Create and customize your AI chatbot in 3 steps"
  },{
    "url":"/assets/img/how_train.png",
    "text":"2 Train your chatbot by scanning or uploading knowledge."
  },{
    "url":"/assets/img/how_install.svg",
    "text":"3 Embed your chatbot to your site."
  }
]
function Section2() {
  const [select, setSelect] = useState(0);

  function selectHowTo(index){
    setSelect(index);
  }

  return (
    <div className="bg-[url('/assets/img/how-it-works-background.png')] py-[184px] px-[92px] mt-[-80px]">
        <div className='flex'>
            <div className='md:w-[50%]'>
                <div className="text-white text-[44px] font-extrabold font-['Public Sans'] leading-[52.80px]">How it works</div>
                <div className="pt-[32px]">
                  {
                    how_to.map((how,index) =>(
                      <div onClick={selectHowTo(index)} key={index} className={"pt-[24px] text-white" + (select==index?" underline underline-offset-4":" opacity-50")}>{how.text}</div>
                    ))
                  }
                </div>
            </div>
            <div className='md:w-[50%]'>
                  {
                      <img src={how_to[select].url}alt="" />
                  }
            </div>
        </div>
    </div>
  )
}

export default Section2