'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { withAuthForLoggedInUsers } from '@/lib/withAuthForLoggedInUsers';
import toast from 'react-hot-toast';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState({ username: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // مسح الخطأ السابق عند محاولة تسجيل الدخول من جديد
        setFieldError({ username: '', password: '' }); // مسح الأخطاء الحقلية

        // التحقق من الحقول
        if (!username) {
            setFieldError(prev => ({ ...prev, username: 'يرجى تعبئة اسم المستخدم' }));
        }
        if (!password) {
            setFieldError(prev => ({ ...prev, password: 'يرجى تعبئة كلمة المرور' }));
        }
        if (!username || !password) {
            return; // إذا كانت الحقول فارغة، لا تكمل عملية التسجيل
        }

        try {
            if (!process.env.NEXT_PUBLIC_API_URL) {
                throw new Error('API URL is not defined');
            }

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { username, password });
            toast.success('تم تسجيل الدخول بنجاح'); 
            Cookies.set('token', data.token, { expires: 1 });
            Cookies.set('username', data.user.username, { expires: 1 });
            router.push('/');
        } catch (error) {
            toast.error('فشلت عملية تسجيل الدخول');
            console.log(error);
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message);
            } else {
                setError('حدث خطأ غير متوقع');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
            if (value) setFieldError(prev => ({ ...prev, username: '' })); // مسح الخطأ عند تعبئة الحقل
        } else {
            setPassword(value);
            if (value) setFieldError(prev => ({ ...prev, password: '' })); // مسح الخطأ عند تعبئة الحقل
        }
    };

    return (
        <div className='flex items-center justify-center h-[150vh]'>
            <div className='w-[856px] h-[587px] rounded-2xl flex bg-[#F6F5F7]'>
                <div className='w-[418px] h-[587px] bg-[#45369f] rounded-s-2xl flex items-center justify-center'>
                    <h1 className='text-white text-center font-[Cairo] text-[96px] leading-[150px] font-bold w-[201px]'>
                        مرحباً بك
                    </h1>
                </div>
                <div className='flex flex-col flex-1 relative'>
                    <div className='absolute top-4 right-4'>
                        <Image src='/logo.png' alt='logo' width={186} height={77} />
                    </div>
                    <div className='flex flex-col items-center justify-center h-full space-y-4'>
                        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center h-full space-y-4'>
                            <div dir='rtl'>
                                <Input
                                    className='border-[1px] border-black w-[375px]'
                                    type='text'
                                    name='username'
                                    placeholder='اسم المستخدم'
                                    value={username}
                                    onChange={handleChange}
                                    dir='rtl'
                                />
                                {fieldError.username && (
                                    <span className='text-red-500 text-sm'>{fieldError.username}</span>
                                )}
                                {error && (
                                    <span className='text-red-500 text-sm'>{error}</span>
                                )}
                            </div>

                            <div dir='rtl'>
                                <Input
                                    className='border-[1px] border-black w-[375px]'
                                    type='password'
                                    name='password'
                                    placeholder='كلمة المرور'
                                    value={password}
                                    onChange={handleChange}
                                    dir='rtl'
                                />
                                {fieldError.password && (
                                    <span className='text-red-500 text-sm'>{fieldError.password}</span>
                                )}
                                {error && (
                                    <span className='text-red-500 text-sm'>{error}</span>
                                )}
                            </div>

                            <Button
                                type='submit'
                                className='w-[252px] bg-[#45369f] hover:bg-[#5643bd]'
                            >
                                تسجيل الدخول
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuthForLoggedInUsers(Login);
