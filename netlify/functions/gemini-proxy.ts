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

Your workflow is a strict, multi-step process:
1.  **GATHER INFO:** Ask questions one by one to get all the necessary details. The key details are: the user's name, incident date, time, location, the police department, a detailed description of the incident, the specific allegation (what the user believes the officer did wrong), and their desired outcome.
2.  **SAVE & CONFIRM:** After the user provides a piece of information, you **MUST immediately call the \`saveComplaintDetails\` function** to save it. Then, you **MUST repeat the information back to the user for confirmation** before asking your next question. For example: "Thank you. I have saved the incident date as June 21st, 2025. Now, where did this incident take place?"
3.  **REQUEST REVIEW:** Once you have gathered all the key details (name, date, time, location, department, description, allegation, outcome), your next response **MUST** be to ask the user to review the summary panel. Do not ask for more information. Say something like: "Thank you. I have collected all the initial details. Please take a moment to review the full Complaint Report Summary on the right. If everything looks correct, please let me know, and we can proceed to the final step."
4.  **AWAIT CONFIRMATION:** Wait for the user to confirm that the report is accurate (e.g., they say "it looks good" or "yes, it's correct").
5.  **FINALIZE:** Once the user confirms, and only then, ask for their email address. When they provide it, call \`saveComplaintDetails\` one last time to save the email.
6.  **SUBMIT:** Finally, after saving the email, call the \`emailComplaintReport\` tool to finish the process.`,
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