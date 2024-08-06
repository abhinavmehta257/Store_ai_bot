import React, { useEffect, useState } from 'react'
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
    <div className="bg-[url('/assets/img/how-it-works-background.png')] md:py-[184px] p-[150px] md:px-[120
    px] px-[32px] mt-[-80px]">
        <div className='flex flex-col-reverse md:flex-row gap-[24px]'>
            <div className='md:w-[50%]'>
                <div className="text-white text-[44px] font-extrabold font-['Public Sans'] leading-[52.80px]">How it works</div>
                <div className="mt-[32px]">
                  {
                    how_to.map((how,index) =>(
                      <div onClick={()=>selectHowTo(index)} key={index} className={"cursor-pointer text-white" + (select==index?" underline underline-offset-4":" opacity-50") + (index != 0 ? " mt-[24px]" : "")}>{how.text}</div>
                    ))
                  }
                </div>
            </div>
            <div className='md:w-[50%] sm:w-full'>
                  {
                      <img className='' src={how_to[select].url}alt="" />
                  }
            </div>
        </div>
    </div>
  )
}

export default Section2