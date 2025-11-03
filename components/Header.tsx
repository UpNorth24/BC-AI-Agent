import React from 'react';
import { BCLogoIcon, RefreshCwIcon, MessageSquareIcon } from './icons';

interface HeaderProps {
    onRequestStartNewReport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRequestStartNewReport }) => {
  return (
    <header className="shadow-md bg-white">
      <div className="h-1.5 bg-[#FCBA19]" />
      <div className="bg-[#003366] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <BCLogoIcon className="h-11 w-auto" />
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Submit an Online Complaint
                  </h1>
                  <p className="text-sm text-gray-200">
                    Office of the Police Complaint Commissioner | AI Agent Pilot
                  </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <a 
                    href="mailto:feedback@example.com?subject=Feedback on Police Complaint AI Pilot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors text-sm"
                    aria-label="Provide Feedback"
                    title="Provide Feedback"
                >
                    <MessageSquareIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Feedback</span>
                </a>
                <button 
                    onClick={onRequestStartNewReport} 
                    className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-md transition-colors text-sm"
                    aria-label="Start New Report"
                    title="Start New Report"
                >
                    <RefreshCwIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">New Report</span>
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;