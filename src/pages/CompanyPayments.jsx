import React, { useEffect, useState } from 'react';
import { fetchPayments } from '../api/paymentService';
import PaymentTable from '../components/payment/PaymentTable';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CompanyPayments = () => {
    const [payments, setPayments] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleFilter = async ({ statuses, search }) => {
        setIsLoading(true);
        try {
            const data = await fetchPayments({ 
                page, 
                statuses: statuses.join(','),
                search: search || undefined
            });
            setPayments(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Error fetching filtered payments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchPayments({ page })
            .then((data) => {
                setPayments(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [page]);

    return (
        <div className="p-6">
            <PaymentTable 
                payments={payments} 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onFilter={handleFilter}
            />
        </div>
    );
};

export default CompanyPayments;
