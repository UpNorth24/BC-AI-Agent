import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { ComplaintDetails } from '../types';
import { FileTextIcon, DownloadIcon } from './icons';

interface ComplaintSummaryProps {
  details: ComplaintDetails;
}

const DetailItem: React.FC<{ label: string; value: string | boolean | null }> = ({ label, value }) => {
  const displayValue = value === null ? '...' : typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  const hasValue = value !== null && value !== '';

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</h3>
      <p className={`mt-1 p-2.5 rounded-md text-sm ${hasValue ? 'bg-white text-gray-800 border border-gray-300' : 'bg-gray-100 text-gray-500 italic'}`}>
        {hasValue ? displayValue : 'Not yet specified'}
      </p>
    </div>
  );
};

const LongDetailItem: React.FC<{ label: string; value: string | null }> = ({ label, value }) => {
  const hasValue = value !== null && value !== '';
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</h3>
      <p className={`mt-1 p-2.5 rounded-md min-h-[50px] whitespace-pre-wrap break-words text-sm ${hasValue ? 'bg-white text-gray-800 border border-gray-300' : 'bg-gray-100 text-gray-500 italic'}`}>
        {hasValue ? value : 'Not yet specified'}
      </p>
    </div>
  );
};

const FileListItem: React.FC<{ label: string; files: string[] }> = ({ label, files }) => {
    const hasFiles = files && files.length > 0;
  
    return (
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</h3>
        <div className={`mt-1 p-2.5 rounded-md text-sm ${hasFiles ? 'bg-white text-gray-800 border border-gray-300' : 'bg-gray-100 text-gray-500 italic'}`}>
          {hasFiles ? (
            <ul className="list-disc list-inside space-y-1">
              {files.map((file, index) => (
                <li key={index} className="truncate">{file}</li>
              ))}
            </ul>
          ) : (
            'No files uploaded'
          )}
        </div>
      </div>
    );
};


const ComplaintSummary: React.FC<ComplaintSummaryProps> = ({ details }) => {
  const isDownloadable = Object.values(details).some(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return true;
    return false;
  });

  const handleDownload = () => {
    if (!isDownloadable) return;

    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Helper to add text and manage y position
    const addText = (text: string, fontStyle: 'bold' | 'normal' = 'normal', size = 10) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', fontStyle);
        const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
        doc.text(splitText, margin, yPos);
        yPos += (doc.getTextDimensions(splitText).h) + 6;
        if (yPos > 280) { doc.addPage(); yPos = 20; }
    };

    const addDetail = (label: string, value: string | boolean | null | string[]) => {
        let displayValue: string;
        if (value === null || value === undefined || value === '') {
            displayValue = 'Not specified';
        } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
        } else if (Array.isArray(value)) {
            displayValue = value.length > 0 ? value.join(', ') : 'None';
        } else {
            displayValue = value;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${label}:`, margin, yPos);
        
        doc.setFont('helvetica', 'normal');
        const valueXPos = margin + 50; // Indent value
        const splitValue = doc.splitTextToSize(displayValue, pageWidth - margin - valueXPos);
        doc.text(splitValue, valueXPos, yPos);
        yPos += (doc.getTextDimensions(splitValue).h) + 8;

        if (yPos > 280) { doc.addPage(); yPos = 20; }
    };

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Police Complaint Summary Report", pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    addText(`Generated on: ${new Date().toLocaleString()}`, 'normal', 8);
    yPos += 8;

    // Details
    addDetail("Complainant Name", details.complainantName);
    addDetail("Email Address", details.emailAddress);
    addDetail("Date of Incident", details.incidentDate);
    addDetail("Time of Incident", details.incidentTime);
    addDetail("Location of Incident", details.incidentLocation);
    addDetail("Police Department", details.policeDepartment);
    addDetail("Involved Officer(s)", details.involvedOfficers);
    addDetail("Witnesses", details.witnesses);
    addDetail("Has Evidence (Photos/Videos)", details.hasEvidence);
    addDetail("Uploaded Evidence Files", details.evidenceFiles);
    yPos += 5;

    // Long Text sections
    addText("DESCRIPTION OF INCIDENT", 'bold', 12);
    addText(details.incidentDescription || 'Not specified');
    yPos += 5;

    addText("ALLEGATION (What you believe the officer did wrong)", 'bold', 12);
    addText(details.allegation || 'Not specified');
    yPos += 5;

    addText("DESIRED OUTCOME", 'bold', 12);
    addText(details.desiredOutcome || 'Not specified');
    
    doc.save('police-complaint-summary.pdf');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <FileTextIcon className="w-6 h-6 text-[#003366]" />
        <h2 className="text-lg font-bold text-gray-800">Complaint Report Summary</h2>
      </div>
      <div className="space-y-5 overflow-y-auto pr-2 -mr-2 flex-1">
        <DetailItem label="Complainant Name" value={details.complainantName} />
        <DetailItem label="Email Address" value={details.emailAddress} />
        <DetailItem label="Date of Incident" value={details.incidentDate} />
        <DetailItem label="Time of Incident" value={details.incidentTime} />
        <DetailItem label="Location of Incident" value={details.incidentLocation} />
        <DetailItem label="Police Department" value={details.policeDepartment} />
        <DetailItem label="Involved Officer(s)" value={details.involvedOfficers} />
        <DetailItem label="Witnesses" value={details.witnesses} />
        <DetailItem label="Has Evidence (Photos/Videos)" value={details.hasEvidence} />
        <FileListItem label="Uploaded Evidence Files" files={details.evidenceFiles} />
        <LongDetailItem label="Description of Incident" value={details.incidentDescription} />
        <LongDetailItem label="Allegation (What you believe the officer did wrong)" value={details.allegation} />
        <LongDetailItem label="Desired Outcome" value={details.desiredOutcome} />
      </div>
       <div className="mt-6 text-xs text-center text-gray-500">
        This summary updates automatically as you provide information.
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
            onClick={handleDownload}
            disabled={!isDownloadable}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-[#003366] text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#002244] transition-colors font-semibold"
        >
            <DownloadIcon className="w-5 h-5" />
            <span>Download Report</span>
        </button>
      </div>
    </div>
  );
};

export default ComplaintSummary;