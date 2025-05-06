import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, ChevronLeft, ChevronRight, X, Wallet } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'react-hot-toast';
import { withDrawFunds } from '../../api/paymentService';
import AddBankAccount from './AddBankAccount';
import { RiArrowRightCircleLine } from 'react-icons/ri';

const PAYMENT_STATUSES = [
    { value: 'HELD', label: 'Held' },
    { value: 'RELEASED', label: 'Released' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'CREATED', label: 'Created' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'PAID', label: 'Paid' }
];

const PaymentTable = ({
    payments = [],
    onFilter,
    currentPage = 0,
    totalPages = 1,
    onPageChange,
    isDeveloperView = false,
    onWithdrawSuccess
}) => {
    const [selectedStatuses, setSelectedStatuses] = useState(['HELD', 'RELEASED', 'REFUNDED', 'CANCELLED', 'PROCESSING', 'FAILED', 'PAID']);
    const [searchQuery, setSearchQuery] = useState('');
    const [withdrawingPaymentId, setWithdrawingPaymentId] = useState(null);
    const [isBankAccountFormOpen, setIsBankAccountFormOpen] = useState(false);
    const [bankDetailsMissing, setBankDetailsMissing] = useState(false);

    const handleFilter = () => {
        onFilter({ statuses: selectedStatuses, search: searchQuery });
    };

    const handleStatusChange = (status) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                return prev.filter(s => s !== status);
            }
            return [...prev, status];
        });
    };

    const handleWithdraw = async (paymentId) => {
        try {
            setWithdrawingPaymentId(paymentId);
            const response = await withDrawFunds(paymentId);
            toast.success('Funds withdrawn successfully');
            if (onWithdrawSuccess) {
                onWithdrawSuccess();
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to withdraw funds';
            
            // Check for "Bank details not found" error and set the state
            if (errorMessage === 'Bank details not found') {
                setBankDetailsMissing(true);
            }
            toast.error(errorMessage);
        } finally {
            setWithdrawingPaymentId(null);
        }
    };

    const openBankAccountForm = () => {
        setIsBankAccountFormOpen(true);
    };

    const closeBankAccountForm = () => {
        setIsBankAccountFormOpen(false);
        setBankDetailsMissing(false);
    };

    const handleBankAccountSuccess = () => {
        closeBankAccountForm();
        // Retry the withdrawal for the last attempted payment
        if (withdrawingPaymentId) {
            handleWithdraw(withdrawingPaymentId);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'held':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'released':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'refunded':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Calculate if pagination should be shown
    const shouldShowPagination = totalPages > 1;

    return (
        <div className="relative">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search payments..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Status Filter
                                        {selectedStatuses.length > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {selectedStatuses.length}
                                            </Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Select Statuses</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedStatuses([])}
                                                className="h-8 px-2"
                                            >
                                                Clear all
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {PAYMENT_STATUSES.map((status) => (
                                                <div key={status.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={status.value}
                                                        checked={selectedStatuses.includes(status.value)}
                                                        onCheckedChange={() => handleStatusChange(status.value)}
                                                    />
                                                    <label
                                                        htmlFor={status.value}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {status.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button
                                onClick={handleFilter}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Apply Filters
                            </Button>
                        </div>
                    </div>

                    {payments && payments.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Application</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Done At</th>
                                            {isDeveloperView && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((p) => (
                                            <tr key={p.externalId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.paymentId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.applicationReferenceId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{p.displayAmount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={getStatusColor(p.status)}>
                                                        {p.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.method}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {p.description ?? "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </td>
                                                {isDeveloperView && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {p.status === 'FAILED' && !bankDetailsMissing && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center gap-2"
                                                                onClick={() => handleWithdraw(p.paymentId)}
                                                                disabled={withdrawingPaymentId === p.paymentId}
                                                            >
                                                                <Wallet className="h-4 w-4" />
                                                                {withdrawingPaymentId === p.paymentId ? 'Withdrawing...' : 'Withdraw'}
                                                            </Button>
                                                        )}
                                                        {bankDetailsMissing && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center gap-2"
                                                                onClick={openBankAccountForm}
                                                            >
                                                                <RiArrowRightCircleLine className="h-4 w-4" />
                                                                Add Bank Account
                                                            </Button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {shouldShowPagination && (
                                <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        <Button
                                            variant="outline"
                                            onClick={() => onPageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => onPageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                                <span className="font-medium">{totalPages}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => onPageChange(currentPage - 1)}
                                                disabled={currentPage === 0}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => onPageChange(currentPage + 1)}
                                                disabled={currentPage >= totalPages - 1}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No payments found. Try adjusting your filters.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Bank Account Modal */}
            {isBankAccountFormOpen && (
                <AddBankAccount 
                    onClose={closeBankAccountForm}
                    onSuccess={handleBankAccountSuccess}
                />
            )}
        </div>
    );
};

export default PaymentTable;
