import { GoogleGenAI, GenerateContentResponse, Content, FunctionDeclaration } from '@google/genai';

interface ProxyRequestBody {
  contents: Content[];
  tools: FunctionDeclaration[];
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { contents, tools }: ProxyRequestBody = JSON.parse(event.body);
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }
    if (!contents || !Array.isArray(contents)) {
        throw new Error("Invalid 'contents' provided in request body.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const result: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: `You are an AI agent for the Office of the Police Complaint Commissioner (OPCC) of British Columbia. Your goal is to help a user file a police complaint by gathering information.

Your workflow is a strict loop:
1.  **Ask a question** to get information.
2.  When the user provides information (like a name, date, or location), you **MUST immediately call the \`saveComplaintDetails\` function** to save it.
3.  After the function call is confirmed, you **MUST repeat the information back to the user for confirmation** before asking your next question. For example: "Thank you. I have saved the incident date as June 21st, 2025. Now, where did this incident take place?"
4.  Continue this loop until all details are gathered. The key details to ask for are: the user's name, incident date, time, location, the police department, a description of the incident, the specific allegation, and their desired outcome.
5.  Once all details are collected, ask for the user's email address and save it.
6.  Finally, ask for confirmation to finalize the report and then call the \`emailComplaintReport\` tool to finish the process.`,
            tools: [{ functionDeclarations: tools }],
        },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Error in proxy function:', error);
    const errorMessage = error.message || "An unknown error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
}