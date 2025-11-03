import React, { useState, useRef, forwardRef } from 'react';
import { SendIcon, PaperclipIcon, XCircleIcon } from './icons';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  isLoading: boolean;
}

const FilePreview: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
    const isOverSize = file.size > MAX_FILE_SIZE_BYTES;
    const fileUrl = URL.createObjectURL(file);
    
    return (
        <div className={`relative p-2 border-2 ${isOverSize ? 'border-red-500' : 'border-transparent'} rounded-lg`}>
            <div className="flex items-center gap-3">
                {file.type.startsWith('image/') ? (
                    <img src={fileUrl} alt="preview" className="w-16 h-16 rounded-md object-cover" />
                ) : (
                    <video src={fileUrl} className="w-16 h-16 rounded-md object-cover" />
                )}
                <div className="text-sm">
                    <p className="font-semibold text-gray-700 truncate max-w-xs">{file.name}</p>
                    <p className={`text-gray-500 ${isOverSize ? 'text-red-600 font-semibold' : ''}`}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            </div>
            {isOverSize && (
                <p className="text-xs text-red-600 mt-1">
                    File is too large. Max size is {MAX_FILE_SIZE_MB} MB.
                </p>
            )}
            <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Remove file"
            >
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(({ onSendMessage, isLoading }, ref) => {
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSendDisabled = isLoading || (!input.trim() && !selectedFile) || (selectedFile && selectedFile.size > MAX_FILE_SIZE_BYTES);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if (isSendDisabled) return;
    onSendMessage(input, selectedFile || undefined);
    setInput('');
    handleRemoveFile();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-100 rounded-b-xl">
        {selectedFile && (
            <div className="mb-3 p-2 bg-gray-200 rounded-lg">
                <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
            </div>
        )}
      <div className="bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-[#003366] transition-shadow duration-200">
        <textarea
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe what happened..."
          className="w-full p-3 bg-transparent rounded-lg focus:outline-none resize-none text-gray-800 placeholder-gray-500 text-base"
          rows={4}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-center justify-end gap-3 mt-3">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
                disabled={isLoading}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm font-semibold p-2 px-4 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
                aria-label="Attach file"
                title="Attach file"
            >
                <PaperclipIcon className="w-5 h-5" />
                <span>Attach File</span>
            </button>
            <button
              onClick={handleSend}
              disabled={isSendDisabled}
              className="flex items-center gap-2 text-sm font-semibold p-2 px-5 rounded-lg bg-[#003366] text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[#002244] transition-colors"
              aria-label="Send message"
              title="Send message"
            >
              <SendIcon className="w-5 h-5" />
              <span>Send</span>
            </button>
        </div>
    </div>
  );
});

export default MessageInput;