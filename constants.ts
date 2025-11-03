import type { ComplaintDetails } from './types';

export const initialComplaintDetails: ComplaintDetails = {
  complainantName: '',
  incidentDate: '',
  incidentTime: '',
  incidentLocation: '',
  policeDepartment: '',
  involvedOfficers: '',
  witnesses: '',
  incidentDescription: '',
  hasEvidence: null,
  allegation: '',
  desiredOutcome: '',
  evidenceFiles: [],
  emailAddress: '',
};