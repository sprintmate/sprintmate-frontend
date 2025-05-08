import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { refundPayment,cancelPayment } from '../api/paymentService';
import { reloadPage } from '../utils/applicationUtils';
import { updateApplicationStatus } from '../api/taskApplicationService';
import { acceptApplicationStatus } from '../api/taskApplicationService';


const Applications = () => {
    const navigate = useNavigate();
    const userProfile = getUserProfile();
    const companyProfile = userProfile?.companyProfiles?.[0];

    const [applicationsData, setApplicationsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10;
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);


    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            const token = getToken();

            const queryParams = new URLSearchParams({
                size: pageSize,
                page: currentPage,
            });
            if (statusFilter !== 'all') queryParams.append('status', statusFilter);
            if (searchTerm.trim()) queryParams.append('searchTerm', searchTerm.trim());

            const response = await axios.get(
                `${apiBaseUrl}/v1/users/${userProfile.userId}/company-profile/${companyProfile.externalId}/applications?${queryParams.toString()}`,
                { headers: { Authorization: token } }
            );

            setApplicationsData(response.data?.content || []);
            setTotalPages(response.data?.totalPages || 0);
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
    }, [currentPage, statusFilter, searchTerm]);


     const handleStatusUpdate = async (taskId,applicationId, newStatus) => {
        try {
        //   setIsLoading(true);
          await updateApplicationStatus(taskId, applicationId, { status: newStatus });
          reloadPage();
          // Show success message
          console.log(`Application ${applicationId} updated to ${newStatus}`);
    
        } catch (err) {
          console.error('Error updating application status:', err);
          // Show error message
          console.error('Failed to update application status:', err.response?.data?.message || err.message);
        } finally {
        //   setIsLoading(false);
        }
      };


    // Handle payment success
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

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-[1500px] mx-auto">
            {/* Hero Section */}
            <motion.div
                className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Banner Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>

                {/* Content */}
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
                                    <span>Total: {applicationsData.length}</span>
                                </span>
                            </motion.div>
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
                            Review and manage all applications for your tasks
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Search and Filter Section */}
            <Card className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/60 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
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
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => {
                            setStatusFilter(val);
                            setCurrentPage(0);
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="APPLIED">Applied</SelectItem>
                            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Applications Table */}
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
                                                <DollarSign size={14} className="text-blue-500" />
                                                <span>{app.task?.budget} {app.task?.currency}</span>
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
                                            <p className="truncate">{app.proposal}</p>
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
                                                    onClick={() => handleOpenChat(app.developer)}
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
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Next
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{applicationsData.length}</span> of{' '}
                                <span className="font-medium">{totalPages * 10}</span> applications
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <div className="flex items-center gap-1 px-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i;
                                    } else if (currentPage < 2) {
                                        pageNum = i;
                                    } else if (currentPage > totalPages - 3) {
                                        pageNum = totalPages - 5 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                            className="w-8 h-8 p-0"
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage((p) => p + 1)}
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

            {/* Payment success notification */}
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
