import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { uploadDocuments } from '../api/documentService';

const DocumentUploader = ({ onUploadComplete, onUploadError, maxFiles = 3, maxSize = 5242880, multiple = true, accept = '.zip', documentType = 'TASK_ATTACHMENT' }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files`);
            return;
        }

        const newFiles = acceptedFiles.map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            progress: 0
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    }, [uploadedFiles, maxFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize: maxSize,
        multiple: multiple,
        disabled: uploadedFiles.length >= maxFiles
    });

    const removeFile = (fileId) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
    };

    const uploadFiles = async () => {
        if (uploadedFiles.length === 0) {
            toast.error('Please select files to upload');
            return;
        }

        setIsUploading(true);
        try {
            // Extract only the files from uploadedFiles
            const filesToUpload = uploadedFiles.map(fileObj => fileObj.file);
            console.log('selected files to uploadd ' , filesToUpload)

            // Call the actual uploadDocuments function to handle the file upload
            const uploaded = await uploadDocuments(filesToUpload, documentType);

            // Assuming uploadDocuments returns an array of externalIds or success statuses
            if (uploaded && uploaded.length > 0) {
                toast.success('Files uploaded successfully');
                
                // Mark files as uploaded by adding a success status
                const updatedFiles = uploadedFiles.map(fileObj => ({
                    ...fileObj,
                    uploaded: true // Mark the file as uploaded
                }));

                // Update the uploaded files state with the new status
                setUploadedFiles(updatedFiles);

                // Optionally call onUploadComplete with the uploaded result
                if (onUploadComplete) {
                    onUploadComplete(uploaded);
                }
            } else {
                throw new Error('No files were uploaded successfully.');
            }
        } catch (error) {
            toast.error('Failed to upload files');
            console.error('Error uploading files:', error);
            if (onUploadError) {
                onUploadError(error);
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">
                            {isDragActive
                                ? "Drop the files here..."
                                : "Drag 'n' drop files here, or click to select files"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Supported formats: .ZIP (max {maxSize / 1024 / 1024} MB)
                        </p>
                    </div>
                </div>

                {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <h3 className="text-sm font-medium text-gray-700">Selected Files</h3>
                        <div className="space-y-3">
                            {uploadedFiles.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {fileObj.file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {fileObj.uploaded ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeFile(fileObj.id)}
                                                className="h-8 w-8 border-2 border-blue-400 hover:bg-blue-50 hover:border-blue-500"
                                            >
                                                <span className="text-blue-600 text-xl hover:text-blue-800 hover:scale-110 transition-all duration-200 ease-in-out">
                                                    x
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                    {uploadProgress[fileObj.id] !== undefined && (
                                        <Progress
                                            value={uploadProgress[fileObj.id]}
                                            className="w-full mt-2"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setUploadedFiles([])}
                                disabled={isUploading}
                            >
                                Clear All
                            </Button>
                            <Button
                                onClick={uploadFiles}
                                disabled={isUploading}
                                className="flex items-center gap-2"
                            >
                                {isUploading ? 'Uploading...' : 'Upload Files'}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DocumentUploader;
