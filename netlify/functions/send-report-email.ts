import sgMail from '@sendgrid/mail';

interface ComplaintDetails {
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

const createEmailHtml = (details: ComplaintDetails): string => {
    const detailToHtml = (label: string, value: string | boolean | null | string[]) => {
        let displayValue: string;
        if (value === null || value === undefined || value === '') {
            displayValue = '<em>Not specified</em>';
        } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
        } else if (Array.isArray(value)) {
            displayValue = value.length > 0 ? `<ul>${value.map(v => `<li>${v}</li>`).join('')}</ul>` : 'None';
        } else {
            displayValue = value.replace(/\n/g, '<br>');
        }
        return `<div style="margin-bottom: 12px;">
                    <p style="margin: 0; color: #555; font-size: 14px; font-weight: bold;">${label}</p>
                    <div style="margin: 4px 0 0 0; padding: 10px; background-color: #f2f2f2; border-radius: 5px;">${displayValue}</div>
                </div>`;
    };

    return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h1 style="font-size: 24px; color: #003366; border-bottom: 2px solid #FCBA19; padding-bottom: 10px;">Police Complaint Summary Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                
                <h2 style="font-size: 18px; color: #003366; margin-top: 20px;">Complaint Details</h2>
                ${detailToHtml('Complainant Name', details.complainantName)}
                ${detailToHtml('Email Address', details.emailAddress)}
                ${detailToHtml('Date of Incident', details.incidentDate)}
                ${detailToHtml('Time of Incident', details.incidentTime)}
                ${detailToHtml('Location of Incident', details.incidentLocation)}
                ${detailToHtml('Police Department', details.policeDepartment)}
                ${detailToHtml('Involved Officer(s)', details.involvedOfficers)}
                ${detailToHtml('Witnesses', details.witnesses)}
                ${detailToHtml('Has Evidence', details.hasEvidence)}
                ${detailToHtml('Uploaded Evidence Files', details.evidenceFiles)}

                <h2 style="font-size: 18px; color: #003366; margin-top: 20px;">Description of Incident</h2>
                <div style="padding: 10px; background-color: #f2f2f2; border-radius: 5px;">${(details.incidentDescription || '<em>Not specified</em>').replace(/\n/g, '<br>')}</div>

                <h2 style="font-size: 18px; color: #003366; margin-top: 20px;">Allegation</h2>
                <div style="padding: 10px; background-color: #f2f2f2; border-radius: 5px;">${(details.allegation || '<em>Not specified</em>').replace(/\n/g, '<br>')}</div>
                
                <h2 style="font-size: 18px; color: #003366; margin-top: 20px;">Desired Outcome</h2>
                <div style="padding: 10px; background-color: #f2f2f2; border-radius: 5px;">${(details.desiredOutcome || '<em>Not specified</em>').replace(/\n/g, '<br>')}</div>

                <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;" />

                <h2 style="font-size: 18px; color: #003366; margin-top: 20px;">Next Steps & Contact Information</h2>
                <p>Thank you for using the AI Agent pilot to file your complaint. Please note that this is a copy for your records.</p>
                <p>For any questions regarding your complaint or the process, please contact the Office of the Police Complaint Commissioner (OPCC) directly:</p>
                <ul>
                    <li><strong>Website:</strong> www.opcc.bc.ca</li>
                    <li><strong>Phone:</strong> (250) 356-7458</li>
                    <li><strong>Toll-Free:</strong> 1-877-999-8707</li>
                </ul>
            </div>
        </div>
    `;
};


export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { details }: { details: ComplaintDetails } = JSON.parse(event.body);
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return { statusCode: 500, body: JSON.stringify({ error: "Email service is not configured correctly. Missing API Key or From Email." }) };
  }
  if (!details || !details.emailAddress) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing complaint details or recipient email address." }) };
  }

  sgMail.setApiKey(apiKey);

  const msg = {
    to: details.emailAddress,
    from: fromEmail,
    subject: 'Your Police Complaint Summary Report',
    html: createEmailHtml(details),
  };

  try {
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email with SendGrid:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email.' }),
    };
  }
}