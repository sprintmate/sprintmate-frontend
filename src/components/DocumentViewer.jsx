import React, { useEffect, useState } from 'react';
import { fetchSecureDocument } from '../api/documentService';

const SupportedPreviewTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'text/plain',
  'text/html',
];

const SecureDocumentViewer = ({ documentId }) => {
  const [docInfo, setDocInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchSecureDocument(documentId);
        setDocInfo(result);
      } catch (err) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [documentId]);

  const handleDownload = () => {
    if (!docInfo) return;
    const link = document.createElement('a');
    link.href = docInfo.fileUrl;
    link.download = docInfo.fileName;
    link.click();
  };

  const isPreviewable = (contentType) => {
    return SupportedPreviewTypes.includes(contentType);
  };

  if (loading) {
    return (
      <div className="inline-flex items-center px-3 py-2 bg-gray-50 rounded mr-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inline-flex items-center px-3 py-2 bg-red-50 rounded mr-2">
        <p className="text-xs text-red-700">{error}</p>
      </div>
    );
  }

  if (!docInfo) return null;

  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded mr-2 group hover:border-blue-500 transition-colors">
      {/* Thumbnail */}
      <div 
        className="w-12 h-12 bg-gray-50 border-r border-gray-200 overflow-hidden cursor-pointer flex items-center justify-center"
        onClick={() => window.open(docInfo.fileUrl, '_blank')}
      >
        {isPreviewable(docInfo.contentType) ? (
          <div className="w-full h-full relative">
            <iframe
              src={`${docInfo.fileUrl}#view=Fit`}
              type={docInfo.contentType}
              className="absolute inset-0"
              style={{ 
                width: '1000%',
                height: '1000%',
                transform: 'scale(0.1)',
                transformOrigin: '0 0',
                border: 'none',
                pointerEvents: 'none'
              }}
              title={`Preview of ${docInfo.fileName}`}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* File Info and Actions */}
      <div className="px-2 py-1 min-w-0">
        <div className="flex items-center">
          <p className="text-xs text-gray-900 truncate max-w-[120px]" title={docInfo.fileName}>
            {docInfo.fileName}
          </p>
          <div className="ml-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
              title="Download"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={() => window.open(docInfo.fileUrl, '_blank')}
              className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
              title="Open in new tab"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-500">
          {docInfo.contentType.split('/')[1].toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default SecureDocumentViewer;
