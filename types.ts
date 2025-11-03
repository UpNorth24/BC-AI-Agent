import type { Part } from '@google/genai';

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string
}

export interface ChatMessage {
  role: 'user' | 'model' | 'tool';
  parts: Part[];
}

export interface ComplaintDetails {
  complainantName: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  policeDepartment: string;
  involvedOfficers: string;
  witnesses: string;
  incidentDescription: string;
  hasEvidence: boolean | null;
  allegation: string;
  desiredOutcome: string;
  evidenceFiles: string[];
  emailAddress: string;
}