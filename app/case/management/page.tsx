'use client';
import { useState, useMemo, useEffect } from "react";
import { withAuthForGuests } from "@/lib/withAuthForGuests";
import {
    Table,
    TableBody,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import axios from "axios";
import Image from "next/image";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef
} from '@tanstack/react-table';
import DialogEditCase from "@/components/case_management/dialogEditCase";

const Page = () => {
    interface Case {
        caseNumber: string;
        defendantName: string;
        imprisonmentDuration: number;
        startDate: string;
        caseID: string;
    }

    const [data, setData] = useState<Case[]>([]);
    const [filteredData, setFilteredData] = useState<Case[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const [caseNumberFilter, setCaseNumberFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const getData = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cases`);
            setData(response.data.cases || []);
            setFilteredData(response.data.cases || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();

    }, []);

    // Filter data in real-time based on case number and date filter
    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(item => {
                const caseNumberMatch = item.caseNumber.includes(caseNumberFilter);

                // حساب موعد التجديد
                const startDate = new Date(item.startDate);
                const renewalDate = new Date(startDate);
                renewalDate.setDate(startDate.getDate() + item.imprisonmentDuration - 1);

                // مقارنة موعد التجديد مع التاريخ المدخل
                const dateMatch = dateFilter
                    ? renewalDate.toISOString().split('T')[0] === dateFilter
                    : true;

                return caseNumberMatch && dateMatch;
            });
            setFilteredData(filtered);
        };
        filterData();
    }, [caseNumberFilter, dateFilter, data]);


    // Define columns with useMemo
    const columns = useMemo<ColumnDef<any>[]>(
        () => [
            { accessorKey: 'id', header: 'رقم التتبع' },
            { accessorKey: 'caseNumber', header: 'رقم القضية' },
            { accessorKey: 'defendantName', header: 'اسم المتهم' },
            { accessorKey: 'imprisonmentDuration', header: 'مدة الحبس' },
            { accessorKey: 'startDate', header: 'بداية المدة', cell: info => new Date(info.getValue() as string).toLocaleDateString('ar-EG') },
            {
                header: 'موعد التجديد',
                cell: info => {
                    const startDate = new Date(info.row.original.startDate);
                    const imprisonmentDuration = info.row.original.imprisonmentDuration;
                    const renewalDate = new Date(startDate);
                    renewalDate.setDate(startDate.getDate() + imprisonmentDuration - 1);
                    return renewalDate.toLocaleDateString('ar-EG');
                }
            },
            
            {
                header: 'تعديل',
                cell: (info) => {
                    return (
                        <div className="flex justify-center items-center w-[50px]">
                            <DialogEditCase caseID={info.row.original.id}>
                                <Image src={'/edit.svg'} width={24} height={24} alt="" />
                            </DialogEditCase>
                        </div>
                    )
                }
            },
        ],
        []
    );

    // Set up the table with pagination and filtering
    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            pagination: { pageIndex: 0, pageSize },
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Pagination Controls
    const handleNextPage = () => table.nextPage();
    const handlePreviousPage = () => table.previousPage();
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPageSize(Number(e.target.value));

    return (
        <div className="flex flex-col items-center h-[110vh] space-y-4">
            <div className="flex flex-col items-center justify-center">
                {/* Filter Section */}
                <div className="flex items-center self-end space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="رقم القضية"
                        value={caseNumberFilter}
                        onChange={(e) => setCaseNumberFilter(e.target.value)}
                        className="border rounded p-2"
                    />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border rounded p-2"
                    />
                </div>

                {/* Table Section */}
                <div className="w-[1110px]">
                    <Table className=" overflow-hidden">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>

                        </TableFooter>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex space-x-2">
                    <button onClick={handlePreviousPage} disabled={!table.getCanPreviousPage()} className="border rounded p-2">
                        السابق
                    </button>
                    {table.getPageOptions().map((pageIndex) => (
                        <button
                            key={pageIndex}
                            onClick={() => table.setPageIndex(pageIndex)}
                            className={`border rounded p-2 ${table.getState().pagination.pageIndex === pageIndex ? 'bg-purple-500 text-white' : ''}`}
                        >
                            {pageIndex + 1}
                        </button>
                    ))}
                    <button onClick={handleNextPage} disabled={!table.getCanNextPage()} className="border rounded p-2">
                        التالي
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withAuthForGuests(Page);
