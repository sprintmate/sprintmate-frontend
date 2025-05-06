import React, { useEffect, useState } from 'react';
import { fetchPayments } from '../api/paymentService';
import PaymentTable from '../components/payment/PaymentTable';

const DeveloperPayments = () => {
    const [payments, setPayments] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchPayments({ page })
            .then((data) => {
                setPayments(data.content);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error(err));
    }, [page]);

    return (
        <div style={{ padding: 20 }}>
            <PaymentTable payments={payments} />
            <div style={{ marginTop: 20 }}>
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Prev
                </button>
                <span style={{ margin: '0 10px' }}>Page {page + 1} of {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default DeveloperPayments;
