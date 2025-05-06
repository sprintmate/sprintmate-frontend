import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PaymentTable = ({ payments, onFilter, currentPage = 0, totalPages = 1, onPageChange }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    if (!payments || payments.length === 0) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="text-center text-gray-500">No payments found.</div>
                </CardContent>
            </Card>
        );
    }

    const handleFilter = () => {
        onFilter({ status: statusFilter, search: searchQuery });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Calculate if pagination should be shown
    const shouldShowPagination = totalPages > 1;

    return (
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
                        <select
                            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <Button
                            onClick={handleFilter}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Apply Filters
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Application</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Done At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((p) => (
                                <tr key={p.externalId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.paymentId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.applicationReferenceId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{p.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={getStatusColor(p.status)}>
                                            {p.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.method}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.paymentProvider}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </td>
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
            </CardContent>
        </Card>
    );
};

export default PaymentTable;
