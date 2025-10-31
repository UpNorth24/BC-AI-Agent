import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, AgentIcon } from './icons';
import type { Part } from '@google/genai';

const AttachmentDisplay: React.FC<{ part: Part }> = ({ part }) => {
    if (!part.inlineData?.mimeType) {
        return <div className="mt-2 text-sm p-2 bg-gray-500 rounded-md">Unsupported file type</div>;
    }

    const { mimeType, data } = part.inlineData;
    const dataUri = `data:${mimeType};base64,${data}`;

    if (mimeType.startsWith('image/')) {
        return <img src={dataUri} alt="User upload" className="mt-2 rounded-lg max-w-xs max-h-64 object-contain" />;
    }
    if (mimeType.startsWith('video/')) {
        return <video src={dataUri} controls className="mt-2 rounded-lg max-w-xs max-h-64" />;
    }
    return <div className="mt-2 text-sm p-2 bg-gray-500 rounded-md">Unsupported file type</div>;
};

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
      {messages.map((message, index) => {
        // Don't render tool responses or model turns that are only function calls
        if (message.role === 'tool' || (message.role === 'model' && message.parts.some(p => !!p.functionCall))) {
            return null;
        }

        const visibleParts = message.parts.filter(p => p.text || p.inlineData);
        if (visibleParts.length === 0) return null;

        return (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'model' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <AgentIcon className="w-6 h-6 text-[#003366]" />
                </div>
              )}
              <div
                className={`flex flex-col max-w-md lg:max-w-lg xl:max-w-xl p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#003366] text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {visibleParts.map((part, partIndex) => {
                    if (part.text) {
                        return <div key={partIndex} className="whitespace-pre-wrap break-words">{part.text}</div>;
                    }
                    if (part.inlineData) {
                        return <AttachmentDisplay key={partIndex} part={part} />;
                    }
                    return null;
                })}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-slate-600" />
                </div>
              )}
            </div>
        );
    })}
      {isLoading && (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <AgentIcon className="w-6 h-6 text-[#003366]" />
          </div>
          <div className="max-w-md p-4 rounded-2xl bg-gray-200 text-gray-600 rounded-bl-none italic">
            Agent is typing...
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;