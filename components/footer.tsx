import Image from "next/image";

const footer = () => {

    return (
        <div className=" w-full  h-[90px] flex justify-around items-center ">
            <div className='flex justify-center items-center gap-5'>
                <h1 className=" text-black">نيابة اجا الجزئية</h1>
            </div>
            <div className='flex justify-center items-center gap-5'>
                <h1 className=" text-black">جميع الحقوق محفوظة لنيابة اجا الجزئية © 2024</h1>
            </div>
            <div className='flex justify-center items-center gap-5'>
                <Image src={'/logo.png'} width={176} height={77} alt="logo" />
            </div>
        </div>
    )
}
export default footer;