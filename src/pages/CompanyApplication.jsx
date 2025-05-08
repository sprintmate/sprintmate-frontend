

import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    User, Calendar, Clock, ChevronLeft, Award,
    Briefcase, CheckCircle, XCircle, Filter, Search,
    DollarSign, Star, Download, ArrowUpRight,
    MessageSquare, FileText, AlertCircle, ExternalLink,
    ChevronRight, Send, X, Phone, Video, MoreVertical,
    Paperclip, Smile, Image, ChevronDown, Play, Pause
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Applications</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Input
                        placeholder="Search task or developer..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                    />
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

                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : applicationsData.length === 0 ? (
                    <p>No applications found</p>
                ) : (
                    <div className="overflow-x-auto border rounded-md">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-xs font-semibold uppercase">
                                <tr>
                                    <th className="p-3">Task Title</th>
                                    <th className="p-3">Budget</th>
                                    <th className="p-3">Deadline</th>
                                    <th className="p-3">Task Status</th>
                                    <th className="p-3">Application Status</th>
                                    <th className="p-3">Proposal</th>
                                    <th className="p-3">Applied On</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicationsData.map((app) => (
                                    <tr key={app.externalId} className="border-t">
                                        <td className="p-3 font-medium">{app.task?.title}</td>
                                        <td className="p-3">
                                            {app.task?.budget} {app.task?.currency}
                                        </td>
                                        <td className="p-3">
                                            {app.task?.deadline
                                                ? new Date(app.task.deadline).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="outline">{app.task?.status}</Badge>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="default">{app.status}</Badge>
                                        </td>
                                        <td className="p-3 max-w-xs truncate">{app.proposal}</td>
                                        <td className="p-3">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 space-y-1">
                                            {/* Action buttons with Accept option for SHORTLISTED */}
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                                                {getAllowedTransitions(app.status)
                                                    .filter((nextStatus) => canRoleUpdateStatus(UserRole.CORPORATE, nextStatus))
                                                    .map((nextStatus) => (
                                                        <Button
                                                            key={nextStatus}
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleStatusUpdate(app.task.externalId , app.externalId, nextStatus)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <div className="flex items-center">
                                                                    <div className="animate-spin mr-1.5 h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
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
                                                    <div className="flex space-x-3">
                                                        <RazorpayPayment
                                                            applicationId={app.externalId}
                                                            onSuccess={handlePaymentSuccess}
                                                            onError={handlePaymentError}
                                                            buttonText="Accept & Pay"
                                                            buttonClassName="bg-green-600 hover:bg-green-700 text-white border-green-700"
                                                        />
                                                    </div>
                                                )}

                                                {app.status !== TaskApplicationStatus.WITHDRAWN && (
                                                    <div className="flex space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 animate-pulse-subtle"
                                                            onClick={() => handleOpenChat(app.developer)}
                                                        >
                                                            <MessageSquare size={14} className="mr-1.5" />
                                                            Chat with Developer
                                                        </Button>

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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Applications;
