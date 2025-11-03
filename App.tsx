import React, { useState, useEffect, useRef } from 'react';
import { FunctionDeclaration, Type, GenerateContentResponse, Part } from '@google/genai';
import type { ChatMessage, ComplaintDetails } from './types';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import ComplaintSummary from './components/ComplaintSummary';
import { initialComplaintDetails } from './constants';

// Helper function to convert File to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

// Custom hook to track the previous value of a state or prop
function usePrevious(value: boolean) {
  // FIX: `useRef` with a generic type requires an initial value.
  // Provided `undefined` as the initial value and updated the type to `boolean | undefined`.
  const ref = useRef<boolean | undefined>(undefined);
  // FIX: Added the dependency array to useEffect. This ensures the ref is updated only when the value changes, which is the correct behavior for this hook.
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const saveComplaintDetailsTool: FunctionDeclaration = {
    name: 'saveComplaintDetails',
    description: 'Saves or updates the details of the police complaint report. Call this function whenever you gather new information from the user.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            complainantName: { type: Type.STRING, description: "The user's full name. Ask if they want to remain anonymous." },
            incidentDate: { type: Type.STRING, description: "The date of the incident. Accept common formats like 'YYYY-MM-DD', 'Month D, YYYY', 'MM/DD/YYYY', or relative terms like 'yesterday' or 'last Tuesday'. Normalize the final value to a YYYY-MM-DD format." },
            incidentTime: { type: Type.STRING, description: "The time of the incident. Accept formats like 'HH:MM AM/PM', 'HH:MM' (24-hour), or descriptive times like 'around noon' or 'late afternoon'. Normalize to HH:MM AM/PM format." },
            incidentLocation: { type: Type.STRING, description: "The location where the incident occurred. Accept full street addresses, intersections (e.g., 'Main St and 12th Ave'), landmarks, or general descriptions. Extract the most specific location given by the user." },
            policeDepartment: { type: Type.STRING, description: "The municipal police department the complaint is about (e.g., Vancouver Police Department, Saanich Police)." },
            involvedOfficers: { type: Type.STRING, description: "Names or badge numbers of the officer(s) involved. Note if unknown." },
            witnesses: { type: Type.STRING, description: "Names of any witnesses. Note if there were none or if they are unknown." },
            incidentDescription: { type: Type.STRING, description: "A detailed summary of what happened during the incident. If the user provided an image or video, describe what you see and add it to this summary." },
            hasEvidence: { type: Type.BOOLEAN, description: "Whether the user has any evidence like photos or videos. If the user uploads a file, set this to true." },
            allegation: { type: Type.STRING, description: "A summary of what the user believes the officer(s) did wrong. This is the specific misconduct being reported." },
            desiredOutcome: { type: Type.STRING, description: "What the user would like to see happen as a result of their complaint (e.g., an apology, an investigation, officer training)." },
            emailAddress: { type: Type.STRING, description: "The user's email address, to which a copy of the final report will be sent." }
        },
        required: [] 
    }
};

const emailComplaintReportTool: FunctionDeclaration = {
    name: 'emailComplaintReport',
    description: 'Finalizes the process by emailing the completed complaint report to the user. Only call this function after you have gathered all necessary details and confirmed with the user that they are ready to complete the report.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            emailAddress: { type: Type.STRING, description: "The user's email address where the report should be sent. You must have already confirmed this with the user." }
        },
        required: ['emailAddress']
    }
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{text: 'Hello. I am an AI agent from the Office of the Police Complaint Commissioner (OPCC) of British Columbia. I am here to help you file a complaint about a municipal police officer. Please describe the incident. Your conversation will be used to generate a formal report.'}]
    }
  ]);
  const [complaintDetails, setComplaintDetails] = useState<ComplaintDetails>(initialComplaintDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportCompleted, setIsReportCompleted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevIsLoading = usePrevious(isLoading);

  useEffect(() => {
    try {
      const savedDetails = localStorage.getItem('complaint-details-storage');
      if (savedDetails) setComplaintDetails(JSON.parse(savedDetails));
      const savedMessages = localStorage.getItem('complaint-chat-history');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 1) {
            setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('complaint-details-storage', JSON.stringify(complaintDetails));
    } catch (error) {
      console.error('Failed to save complaint details to localStorage', error);
    }
  }, [complaintDetails]);

  useEffect(() => {
    try {
        if (messages.length > 1) {
            localStorage.setItem('complaint-chat-history', JSON.stringify(messages));
        }
    } catch (error) {
      console.error('Failed to save chat history to localStorage', error);
    }
  }, [messages]);

  // This effect handles focusing the input after the AI is done "typing"
  useEffect(() => {
    // We only want to focus if the loading state just changed from true to false
    if (prevIsLoading && !isLoading && !isReportCompleted) {
      inputRef.current?.focus();
    }
  }, [isLoading, prevIsLoading, isReportCompleted]);
  
  const processAIResponse = async (history: ChatMessage[]) => {
      let currentHistory = [...history];

      try {
          while (true) {
              const apiContents = currentHistory.map(m => ({ role: m.role, parts: m.parts }));
              const response: GenerateContentResponse = await fetch('/.netlify/functions/gemini-proxy', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ contents: apiContents, tools: [saveComplaintDetailsTool, emailComplaintReportTool] }),
              }).then(res => {
                  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
                  return res.json();
              });

              if (!response.candidates?.[0]?.content?.parts) {
                  throw new Error("Invalid response structure from AI.");
              }
              
              const modelParts = response.candidates[0].content.parts;
              const modelTurn: ChatMessage = { role: 'model', parts: modelParts };
              currentHistory.push(modelTurn);
              setMessages(currentHistory); // Update UI with model's turn (function call or text)

              const functionCalls = modelParts.filter(part => part.functionCall).map(part => part.functionCall);

              if (functionCalls.length > 0) {
                  const fc = functionCalls[0];
                  let toolResponseResult = "Success";
                  let toolResponseName = fc.name;

                  if (fc.name === 'saveComplaintDetails') {
                      const newDetails = fc.args;
                      // Use a state updater function to ensure we get the latest state
                      setComplaintDetails(prev => ({ ...prev, ...newDetails }));
                      toolResponseResult = "Details saved. Continue conversation.";
                  }

                  if (fc.name === 'emailComplaintReport') {
                      try {
                          // Fetch the most up-to-date details before sending
                          const latestDetails = await new Promise<ComplaintDetails>(resolve => {
                              setComplaintDetails(prev => {
                                  const updated = { ...prev, ...fc.args };
                                  resolve(updated);
                                  return updated;
                              });
                          });

                          await fetch('/.netlify/functions/send-report-email', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ details: latestDetails }),
                          });

                          toolResponseResult = "Report successfully emailed.";
                          setIsReportCompleted(true);
                      } catch (e: any) {
                          toolResponseResult = `Failed to send email: ${e.message}. Inform the user.`;
                      }
                  }

                  const toolTurn: ChatMessage = {
                      role: 'tool',
                      parts: [{ functionResponse: { name: toolResponseName, response: { result: toolResponseResult } } }]
                  };
                  currentHistory.push(toolTurn);
                  // Loop will continue, sending the tool response back to the AI
              } else {
                  // If there are no function calls, the AI has finished its turn with a text response.
                  break; // Exit the loop
              }
          }
      } catch (error: any) {
          console.error('Error in AI processing loop:', error);
          const errorMessage: ChatMessage = { role: 'model', parts: [{ text: `Sorry, I encountered an error: ${error.message}` }] };
          setMessages(prev => [...prev, errorMessage]);
      } finally {
          setIsLoading(false);
      }
  };


  const handleSendMessage = async (userInput: string, file?: File) => {
    if ((!userInput.trim() && !file) || isLoading || isReportCompleted) return;
    setIsLoading(true);

    const userParts: Part[] = [];
    if (userInput.trim()){
        userParts.push({ text: userInput });
    }
    if (file) {
        try {
            const base64Data = await fileToBase64(file);
            userParts.push({ inlineData: { mimeType: file.type, data: base64Data }});
            setComplaintDetails(prev => ({ ...prev, hasEvidence: true, evidenceFiles: [...prev.evidenceFiles, file.name]}));
        } catch (error) {
            console.error('Error processing file:', error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: 'Sorry, I could not process the attached file.' }] };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }
    }
    
    const userMessage: ChatMessage = { role: 'user', parts: userParts };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    
    await processAIResponse(newHistory);
  };
  
  const onRequestStartNewReport = () => {
    const confirmation = window.confirm("Are you sure you want to start a new report? Your current progress will be lost.");
    if (confirmation) {
      handleStartNewReport();
    }
  };

  const handleStartNewReport = () => {
    setMessages([
      {
        role: 'model',
        parts: [{text: 'Hello. I am an AI agent from the Office of the Police Complaint Commissioner (OPCC) of British Columbia. I am here to help you file a complaint about a municipal police officer. Please describe the incident. Your conversation will be used to generate a formal report.'}]
      }
    ]);
    setComplaintDetails(initialComplaintDetails);
    setIsReportCompleted(false);
    localStorage.removeItem('complaint-chat-history');
    localStorage.removeItem('complaint-details-storage');
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50 text-gray-800">
      <Header onRequestStartNewReport={onRequestStartNewReport} />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4 max-w-7xl mx-auto w-full">
        <div className="flex flex-col flex-1 lg:w-3/f5 xl:w-2/3 h-full bg-white rounded-xl shadow-lg">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <MessageInput ref={inputRef} onSendMessage={handleSendMessage} isLoading={isLoading || isReportCompleted} />
          {isReportCompleted && (
            <div className="p-4 text-center bg-green-100 text-green-800 font-semibold rounded-b-xl border-t border-green-200">
                Report Finalized. You can now download your report or start a new one.
            </div>
          )}
        </div>
        <div className="flex-1 lg:w-2/5 xl:w-1/3 h-full overflow-y-auto">
          <ComplaintSummary details={complaintDetails} />
        </div>
      </main>
    </div>
  );
};

export default App;