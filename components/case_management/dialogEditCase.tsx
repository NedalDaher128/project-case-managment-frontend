'use client';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogEditCaseProps } from "@/types/DialogEditCase";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';

// تعريف نوع UpdatedCaseFields
interface UpdatedCaseFields {
  id: string;
  caseNumber?: string;
  defendantName?: string;
  startDate?: string;
  imprisonmentDuration?: string;
}

const ModalEditCase = ({ children, caseID }: DialogEditCaseProps) => {
  const [caseNumber, setCaseNumber] = useState('');
  const [accusedName, setAccusedName] = useState('');
  const [caseDate, setCaseDate] = useState('');
  const [casePrisonDate, setCasePrisonDate] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFields: UpdatedCaseFields = { id: caseID.toString() }; // استخدام النوع المخصص

    if (caseNumber) updatedFields.caseNumber = caseNumber;
    if (accusedName) updatedFields.defendantName = accusedName;
    if (caseDate) updatedFields.startDate = caseDate;
    if (casePrisonDate) updatedFields.imprisonmentDuration = casePrisonDate;

    if (Object.keys(updatedFields).length > 1) { // Check if at least one field is filled
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error('API URL is not defined');
        }
        const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/cases/edit`, updatedFields);
        toast.success('تم التحديث بنجاح!');
      } catch (error) {
        toast.error('فشلت عملية التحديث');
        if (axios.isAxiosError(error) && error.response) {
          console.log(error.response.data.message);
        } else {
          console.log('An unexpected error occurred');
        }
      }
    } else {
      toast.error('يرجى ملء حقل واحد على الأقل للتحديث');
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
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent dir="rtl" className="bg-[#1B2431] text-white border-none">
        <DialogHeader>
          <DialogTitle>تعديل القضية</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-center">
          <div className="flex flex-col space-y-5 space-x-4">
            <label htmlFor="caseNumber">رقم القضية</label>
            <Input name="caseNumber" onChange={handleChange} type="text" min="1" placeholder="رقم القضية" className="bg-[#273142] text-white w-full" />
          </div>
          <div className="flex flex-col space-y-5 space-x-4">
            <label htmlFor="accusedName">اسم المتهم</label>
            <Input name="accusedName" onChange={handleChange} type="text" placeholder="اسم المتهم" className="bg-[#273142] text-white w-full" />
          </div>
          <div className="flex flex-col space-y-5 space-x-4">
            <label htmlFor="caseDate">مدة البداية</label>
            <Input name="caseDate" onChange={handleChange} type="date" placeholder="بداية الحبس" className="bg-[#273142] text-white w-full" />
          </div>
          <div className="flex flex-col space-y-5 space-x-4">
            <label htmlFor="casePrisonDate">مدة الحبس</label>
            <Input name="casePrisonDate" onChange={handleChange} type="number" min="1" placeholder="مدة الحبس" className="bg-[#273142] text-white w-full" />
          </div>
          <Button type="submit" variant="default" className="bg-[#4741DE] hover:bg-[#6A68FF] self-center min-w-56">حفظ التعديلات</Button>
        </form>
        <DialogFooter className="mt-4"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditCase;
