import Image from 'next/image'

export default () => {
    return(
        <div className="grid grid-cols-12 py-4">
            <div className="icon col-span-1 bg-[#183c33] mr-auto rounded-full p-2">
                <Image src="/assets/gpt.png" width={50} height={50} alt="profile" ></Image>    
            </div>
            <div className='answer col-span-11 px-4'>
                <p className='text-lg py-4'>ChatGPT is a chat bot</p>
            </div>
             
        </div>
    )
}