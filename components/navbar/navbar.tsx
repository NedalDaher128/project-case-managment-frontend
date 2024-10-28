'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './style.scss';
import Cookies from 'js-cookie';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { names } from '@/data/navbarName';
import Link from 'next/link';

export default function Navbar() {
    const [token, setToken] = useState<string | undefined>(undefined);
    const username = Cookies.get('username');
    const router = useRouter();

    useEffect(() => {
        // دالة للتحقق من التوكن في الكوكيز
        const checkToken = () => {
            const tokenFromCookie = Cookies.get('token');
            setToken(tokenFromCookie);
        };

        // استدعاء التحقق عند تحميل المكون
        checkToken();

        // تعيين مراقبة دورية للتحديث كل ثانيتين
        const interval = setInterval(() => {
            checkToken();
        }, 2000);

        // إزالة المراقبة عند إلغاء تحميل المكون
        return () => clearInterval(interval);

    }, [router]);

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <div className='flex flex-row-reverse items-center justify-center gap-5 space-y-2'>
                        <h1>نيابة اجا الجزئية</h1>
                        {
                            token && (
                                <DropdownMenu >
                                    <DropdownMenuTrigger className='select-none'>
                                        <Avatar>
                                            <AvatarImage src="/admin.png" />
                                            <AvatarFallback>admin</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Hello {username}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            Cookies.remove('token');
                                            Cookies.remove('username');
                                            router.push('/login');
                                        }}>logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )
                        }
                    </div>
                </li>
                <li>
                    <div className=" flex flex-row justify-center items-center bg-red-500cursor-pointer gap-3 ">
                        {

                            names.map((name) => (
                                <Link className=' text-lg' key={name} href={name === 'مواعيد تجديد المتهمين' ? '/case/management' : '/case/add'}>
                                    {name}
                                </Link>
                            ))
                        }

                    </div>

                </li>
                <li>
                    <Image src='/logo.png' alt='logo' width={242} height={100} />
                </li>
            </ul>
        </nav>
    );
}
