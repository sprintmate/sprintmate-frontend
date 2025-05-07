import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Loader2
} from 'lucide-react';

import DocumentUploader from '../DocumentUploader';


export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText, isLoading, showSubmitDocuments,
  setAttachedDocs, }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      style={{ cursor: 'default' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'default' }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {showSubmitDocuments && (
          <DocumentUploader
            onUploadComplete={setAttachedDocs}
            disabled={isLoading}
          />
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer hover:bg-gray-100"
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 cursor-pointer"
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
