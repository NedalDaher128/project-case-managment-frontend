'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from 'axios';
import { withAuthForGuests } from "@/lib/withAuthForGuests";
import toast from 'react-hot-toast';

const Page = () => {
    const [caseNumber, setCaseNumber] = useState('');
    const [accusedName, setAccusedName] = useState('');
    const [caseDate, setCaseDate] = useState('');
    const [casePrisonDate, setCasePrisonDate] = useState('');
    const [caseRenewalDate, setCaseRenewalDate] = useState('');

    useEffect(() => {
        if (caseDate && casePrisonDate) {
            const startDate = new Date(caseDate);
            startDate.setDate(startDate.getDate() + parseInt(casePrisonDate, 10) - 1);
            setCaseRenewalDate(startDate.toISOString().split('T')[0]);
        }
    }, [caseDate, casePrisonDate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!process.env.NEXT_PUBLIC_API_URL) {
                throw new Error('API URL is not defined');
            }
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cases/add`, { caseNumber, defendantName: accusedName, startDate: caseDate, imprisonmentDuration: casePrisonDate });
            toast.success('تم إضافة القضية بنجاح');

        } catch (error) {
            toast.error('فشلت عملية إضافة القضية');
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data.message);
            } else {
                console.log('An unexpected error occurred');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case 'caseNumber':
                setCaseNumber(value);
                break;
            case 'accusedName':
                setAccusedName(value);
                break;
            case 'caseDate':
                setCaseDate(value);
                break;
            case 'casePrisonDate':
                setCasePrisonDate(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex items-center justify-center h-[120vh]">
            <div className=" w-[427px] h-[506px] bg-[#1A1A1A] rounded-2xl flex items-center justify-center">
                <form onSubmit={handleSubmit} className="flex w-[348px] h-[433px] justify-center items-center content-center gap-x-[36px] gap-y-[40px] flex-shrink-0 flex-wrap">
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white  text-sm" htmlFor="accusedName">اسم المتهم</label>
                        <Input type="text" onChange={handleChange} name="accusedName" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseNumber">رقم القضية</label>
                        <Input type="text" onChange={handleChange} name="caseNumber" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="caseDate">بداية المدة</label>
                        <Input type="date" onChange={handleChange} name="caseDate" />
                    </div>
                    <div dir="rtl" className="w-[156px]">
                        <label className=" text-white text-sm" htmlFor="casePrisonDate">مدة الحبس</label>
                        <Input type="number" onChange={handleChange} name="casePrisonDate" min="1" />
                    </div>
                    <div dir="rtl" className="w-[273px]">
                        <label className=" text-white text-sm" htmlFor="caseRenewalDate">موعد التجديد</label>
                        <Input type="date" value={caseRenewalDate} readOnly />
                    </div>
                    <Button type="submit" className="w-[252px] bg-[#45369f] hover:bg-[#5643bd]">
                        إضافة
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default withAuthForGuests(Page);
