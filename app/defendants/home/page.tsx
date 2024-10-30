"use client"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Cookies from 'js-cookie'; // استيراد مكتبة js-cookie
import Link from 'next/link';
import { withAuthForGuests } from '@/lib/withAuthForGuests';


const Home =()=> {
  const names = ['مواعيد تجديد المتهمين', 'أدراج قضية'];
  const token = Cookies.get('token');
  useEffect(() => {
    AOS.init();
  }, []);
  return (
   <div className=" container_items ">
      {
        names.map((name) => (
          <Link href={name === 'مواعيد تجديد المتهمين' ? '/defendants/case/management' : '/defendants/case/add'}  className="item flex items-center  shadow-2xl cursor-pointer  " data-aos={name === 'مواعيد تجديد المتهمين' ? 'fade-right' : 'fade-left'}  data-aos-duration="3000"  key={name}>
            <h1 className=" font-bold text-6xl w-[427px] text-center select-none">{name}</h1>
          </Link>
        ))
      }
   </div>
  );
}

export default withAuthForGuests(Home);
