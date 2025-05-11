import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CurrencyFormatter from '../components/ui/CurrencyFormatter';
import {
    User, Calendar, Clock, ChevronLeft, Award,
    Briefcase, CheckCircle, XCircle, Filter, Search,
    DollarSign, Star, Download, ArrowUpRight,
    MessageSquare, FileText, AlertCircle, ExternalLink,
    ChevronRight, Send, X, Phone, Video, MoreVertical,
    Paperclip, Smile, Image, ChevronDown, Play, Pause,
    Sparkles, Eye, Users
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { authUtils } from '@/utils/authUtils';
import { getToken, fetchUserProfile, getUserProfile } from '../services/authService'; // Update imports
import {
    TaskApplicationStatus,
    Role,
    STATUS_LABELS,
    getAllowedTransitions,
    canRoleUpdateStatus,
    STATUS_DIALOG_CONFIG
} from '../constants/taskApplicationStatusMachine';
import { UserRole } from '../constants/Role';
import RazorpayPayment from '../components/common/RazorpayPayment';
import { refundPayment, cancelPayment } from '../api/paymentService';
import { getBaseRedirectionPath, getDeveloperProfileRedirectionPath, reloadPage } from '../utils/applicationUtils';
import { updateApplicationStatus } from '../api/taskApplicationService';
import { acceptApplicationStatus } from '../api/taskApplicationService';
import { MultiSelect } from "@/components/ui/multi-select";
import { fetchApplications as getApplications } from '../api/taskApplicationService';
import { getChatRedirectionPath } from '../components/chat/Rooms';

const APPLICATION_STATUSES = [
    { value: 'SHORTLISTED', label: 'Shortlisted' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'APPLIED', label: 'Applied' },
    { value: 'CANCELLED', label: 'Cancelled' }

];

const SORT_OPTIONS = [
    { value: 'createdAt,desc', label: 'Newest First' },
    { value: 'createdAt,asc', label: 'Oldest First' },
    { value: 'updatedAt,desc', label: 'Recently Updated' },
    { value: 'updatedAt,asc', label: 'Least Recently Updated' }
];


function getPaginationInfo(currentPage, itemsPerPage, totalItems) {
    // Calculate start and end items for the current page (currentPage is 0-based)
    const startItem = currentPage * itemsPerPage + 1;
    const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

    // Calculate total number of pages (rounded up)
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
        startItem,
        endItem,
        totalItems,
        totalPages
    };
}


const Applications = () => {
    const navigate = useNavigate();
    const userProfile = getUserProfile();
    const companyProfile = userProfile?.companyProfiles?.[0];

    const [applicationsData, setApplicationsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [paginationInfo, setPaginationInfo] = useState({});

    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [sortBy, setSortBy] = useState('createdAt,desc');
    const [appliedFilters, setAppliedFilters] = useState({
        statuses: [],
        sort: 'createdAt,desc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 7;
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);


    const handleOpenChat = (app) => {
        const taskId = app.task.externalId;
        const applicationId = app.externalId;
        const url = getChatRedirectionPath(taskId, applicationId);
        navigate(url);
    };

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams({
                size: pageSize,
                page: currentPage,
                sort: appliedFilters.sort
            });
            if (appliedFilters.statuses.length > 0) {
                appliedFilters.statuses.forEach(status => {
                    queryParams.append('statuses', status);
                });
            }
            if (searchTerm.trim()) {
                queryParams.append('search', searchTerm.trim());
            }
            const response = await getApplications(userProfile.userId, companyProfile.externalId, queryParams);
            setApplicationsData(response.data?.content || []);
            setTotalPages(response.data?.totalPages || 0);
            setTotalItems(response.data.totalElements);
            setPaginationInfo(getPaginationInfo(currentPage, response.data.pageable.pageSize, response.data.totalElements));

        } catch (err) {
            console.error(err);
            setError('Failed to load applications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userProfile?.userId && companyProfile?.externalId) {
            fetchApplications();
        }
    }, [currentPage, appliedFilters, searchTerm]);

    const handleStatusUpdate = async (taskId, applicationId, newStatus) => {
        try {
            await updateApplicationStatus(taskId, applicationId, { status: newStatus });
            reloadPage();
            console.log(`Application ${applicationId} updated to ${newStatus}`);
        } catch (err) {
            console.error('Error updating application status:', err);
            console.error('Failed to update application status:', err.response?.data?.message || err.message);
        }
    };

    const handlePaymentSuccess = async (paymentData) => {
        try {
            console.log("handlePaymentSuccess payment data ", paymentData)
            reloadPage();
            const response = await acceptApplicationStatus(paymentData.taskId, paymentData.applicationId);
            if (response) {
                setPaymentSuccessful(true);
            } else {
                setPaymentSuccessful(false);
                const refundPaymentResponse = await refundPayment(paymentData.paymentId);
                console.log("payment refunded {}", refundPaymentResponse);
            }
            console.log('Payment successful!', paymentData);
        } catch (error) {
            const cancelResponse = await cancelPayment(paymentData.paymentId);
            console.log("payment cancelPayment {}", cancelResponse);
            console.error('Error updating application status after payment', error);
        }
    };

    const handlePaymentError = (error) => {
        console.error('Payment failed', error);
    };

    const handleStatusChange = (values) => {
        setSelectedStatuses(values);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    const handleApplyFilters = () => {
        setAppliedFilters({
            statuses: selectedStatuses,
            sort: sortBy
        });
        setCurrentPage(0);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-[1500px] mx-auto">
            <motion.div
                className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white">
                    <div className="max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                            Applications Dashboard
                            <motion.div
                                className="ml-3 inline-flex items-center"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                            >
                                <span className="bg-white/20 backdrop-blur-sm text-xs rounded-full py-1 px-2 flex items-center gap-1 font-normal">
                                    <Sparkles size={12} className="text-yellow-300" />
                                    <span>Total: {totalItems}</span>
                                </span>
                            </motion.div>
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
                            Review and manage all applications for your tasks
                        </p>
                    </div>
                </div>
            </motion.div>

            <Card className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/60 mb-8">
                <div className="space-y-4">
                    <div className="w-full">
                        <Input
                            placeholder="Search task or developer..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Application Status</label>
                            <MultiSelect
                                options={APPLICATION_STATUSES}
                                value={selectedStatuses}
                                onValueChange={handleStatusChange}
                                placeholder="Select statuses..."
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select sort option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORT_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button
                                onClick={handleApplyFilters}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Task Title</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Budget</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Deadline</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Task Status</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Application Status</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Developer</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Proposal</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Applied On</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600">Loading applications...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4">
                                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                                            <p>{error}</p>
                                            <Button
                                                onClick={() => { setError(null); fetchApplications(); }}
                                                variant="outline"
                                                className="mt-2"
                                            >
                                                Try Again
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : applicationsData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4">
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                                <FileText className="text-blue-600" size={24} />
                                            </div>
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
                                            <p className="mt-2 text-sm text-gray-500">There are no applications matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                applicationsData.map((app) => (
                                    <tr key={app.externalId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100/80 flex items-center justify-center">
                                                    <Briefcase size={15} className="text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{app.task?.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <CurrencyFormatter currency={app.task?.currency}>
                                                    {app.task?.budget}
                                                </CurrencyFormatter>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-blue-500" />
                                                <span>{app.task?.deadline ? new Date(app.task.deadline).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline">{app.task?.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    app.status === 'ACCEPTED' ? "green" :
                                                        app.status === 'SHORTLISTED' ? "yellow" :
                                                            app.status === 'REJECTED' ? "red" :
                                                                "blue"
                                                }
                                                className="capitalize"
                                            >
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            {app.developer.developerName ? (
                                                <a
                                                    href={getDeveloperProfileRedirectionPath(app.developer.externalId)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline hover:text-blue-800"
                                                >
                                                    <span className="truncate">{app.developer.developerName}</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M12.293 2.293a1 1 0 011.414 0L18 6.586a1 1 0 010 1.414l-8.586 8.586a1 1 0 01-1.414 0L7 13.414a1 1 0 010-1.414L15.586 3H13a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V4.414l-8.586 8.586a3 3 0 01-4.243 0l-1.293-1.293a3 3 0 010-4.243l8.586-8.586z" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="truncate">{app.proposal || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-blue-500" />
                                                <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50"
                                                    onClick={() => handleOpenChat(app)}
                                                >
                                                    <MessageSquare size={14} className="mr-1" />
                                                    Chat
                                                </Button>
                                                {getAllowedTransitions(app.status)
                                                    .filter((nextStatus) => canRoleUpdateStatus(UserRole.CORPORATE, nextStatus))
                                                    .map((nextStatus) => (
                                                        <Button
                                                            key={nextStatus}
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleStatusUpdate(app.task.externalId, app.externalId, nextStatus)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <div className="flex items-center">
                                                                    <div className="animate-spin mr-1.5 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                                                    Loading...
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <XCircle size={14} className="mr-1.5" />
                                                                    {STATUS_LABELS[nextStatus] || `Move to ${nextStatus}`}
                                                                </>
                                                            )}
                                                        </Button>
                                                    ))}
                                                {app.status === TaskApplicationStatus.SHORTLISTED && (
                                                    <RazorpayPayment
                                                        applicationId={app.externalId}
                                                        onSuccess={handlePaymentSuccess}
                                                        onError={handlePaymentError}
                                                        buttonText="Accept & Pay"
                                                        buttonClassName="bg-green-600 hover:bg-green-700 text-white border-green-700"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{paginationInfo.startItem}</span> to{' '}
                                <span className="font-medium">{paginationInfo.endItem}</span> of{' '}
                                <span className="font-medium">{paginationInfo.totalItems}</span> results
                            </p>
                            <p className="text-sm text-gray-700">
                                Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                                <span className="font-medium">{paginationInfo.totalPages}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
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


            {paymentSuccessful && (
                <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-start space-x-3 z-50 max-w-md">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-green-800">Payment Successful</h3>
                        <p className="text-green-600 text-sm">Your payment has been processed and the application has been accepted.</p>
                        <Button
                            variant="link"
                            className="text-xs p-0 h-auto text-green-700"
                            onClick={() => setPaymentSuccessful(false)}
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications;
