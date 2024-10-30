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
   <div className=" container_items  h-[60vh]">
      <h1 className=' text-6xl'>
      منظومة تيسر الاعمال داخل ناية اجا الجزئية
      </h1>
   </div>
  );
}

export default withAuthForGuests(Home);
