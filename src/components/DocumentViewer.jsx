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

const ExcelMimeTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'application/vnd.ms-excel.template.macroEnabled.12',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/xlsx',
  'application/xls'
];

const ZipMimeTypes = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'application/octet-stream'
];

const FileTypeIcons = {
  'application/pdf': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'application/zip': 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  'application/vnd.ms-excel': 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'default': 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
};

const SecureDocumentViewer = ({ documentId }) => {
  const [docInfo, setDocInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const result = await fetchSecureDocument(documentId);
        setDocInfo(result);
      } catch (err) {
        console.error(`Failed to load document ${documentId}:`, err);
        // setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    loadDocument();
  }, [documentId]);

  const handleDownload = async () => {
    if (!docInfo?.fileUrl || !docInfo?.fileName) return;
    try {
      const response = await fetch(docInfo.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = docInfo.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const isPreviewable = (type) => SupportedPreviewTypes.includes(type);
  const isExcel = (type) => ExcelMimeTypes.includes(type);
  const isZip = (type) => ZipMimeTypes.includes(type);

  const getIconPath = (type) => {
    if (isExcel(type)) return FileTypeIcons['application/vnd.ms-excel'];
    if (isZip(type)) return FileTypeIcons['application/zip'];
    return FileTypeIcons[type] || FileTypeIcons.default;
  };

  const getFileLabel = (type) => {
    if (isExcel(type)) return 'EXCEL';
    if (isZip(type)) return 'ZIP';
    return (type?.split('/')?.[1] || 'FILE').toUpperCase();
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

  const { fileUrl, fileName, contentType } = docInfo;

  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded mr-2 group hover:border-blue-500 transition-colors">
      {/* Thumbnail or Icon */}
      <div
        className="w-12 h-12 bg-gray-50 border-r border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={() => window.open(fileUrl, '_blank')}
      >
        {isPreviewable(contentType) && contentType.startsWith('image/') ? (
          <img src={fileUrl} alt={fileName} className="object-contain w-full h-full" />
        ) : contentType === 'application/pdf' ? (
          <iframe
            src={`${fileUrl}#view=FitH`}
            className="w-[300px] h-[400px] scale-[0.1] origin-top-left pointer-events-none"
            title={`Preview of ${fileName}`}
            style={{ transform: 'scale(0.1)', transformOrigin: 'top left', width: '1000px', height: '1400px', border: 'none' }}
          />
        ) : (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getIconPath(contentType)} />
          </svg>
        )}
      </div>

      {/* File Details */}
      <div className="px-2 py-1 min-w-0">
        <div className="flex items-center">
          <p className="text-xs text-gray-900 truncate max-w-[120px]" title={fileName}>{fileName}</p>
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
              onClick={() => window.open(fileUrl, '_blank')}
              className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
              title="Open in new tab"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-500">{getFileLabel(contentType)}</p>
      </div>
    </div>
  );
};

export default SecureDocumentViewer;
