export interface AgreementDetails {
  landlordName: string;
  landlordAadhaar?: string;
  tenantName: string;
  tenantAadhaar?: string;
  address: string;
  city: string;
  state: string;
  rent: string;
  deposit: string;
  duration: string;
  startDate: string;
  noticePeriod: string;
  utilities: string;
  specialClauses?: string;
}

export function generateOfflineRentalAgreement(details: AgreementDetails): string {
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const landlordAadhaarText = details.landlordAadhaar ? ` (Aadhaar: ${details.landlordAadhaar})` : '';
  const tenantAadhaarText = details.tenantAadhaar ? ` (Aadhaar: ${details.tenantAadhaar})` : '';

  return `RENTAL AGREEMENT

This Rent Agreement is made on this ${date}, by and between:

${details.landlordName}${landlordAadhaarText}, hereinafter referred to as the "Landlord" (which expression shall include their heirs, legal representatives, successors and assigns) of the ONE PART.

AND

${details.tenantName}${tenantAadhaarText}, hereinafter referred to as the "Tenant" (which expression shall include their heirs, legal representatives, successors and assigns) of the OTHER PART.

WHEREAS the Landlord is the absolute owner of the property located at ${details.address}, ${details.city}, ${details.state} (hereinafter referred to as the "Demised Premises").

WHEREAS the Tenant has requested the Landlord to grant them a tenancy of the Demised Premises, and the Landlord has agreed to do so subject to the terms and conditions hereinafter set forth.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. TERM OF LEASE
The lease shall be for a period of ${details.duration}, commencing from ${details.startDate}.

2. RENT
The Tenant shall pay a monthly rent of ₹${details.rent}/- to the Landlord on or before the 5th day of every calendar month.

3. SECURITY DEPOSIT
The Tenant has paid a refundable, interest-free security deposit of ₹${details.deposit}/- to the Landlord at the time of signing this agreement. This deposit shall be refunded to the Tenant at the time of vacating the Demised Premises, subject to deductions for any pending dues or damages caused to the property (normal wear and tear excepted).

4. UTILITIES
The Tenant shall bear the charges for the following utilities during the lease period: ${details.utilities || 'None specified'}. Any other statutory taxes or property taxes shall be borne by the Landlord.

5. NOTICE PERIOD
Either party can terminate this agreement by giving a written notice of ${details.noticePeriod} to the other party.

6. USE OF PREMISES
The Tenant shall use the Demised Premises strictly for residential purposes only and shall not use it for any commercial or illegal activities.

7. MAINTENANCE AND REPAIRS
The Tenant shall keep the Demised Premises in good condition. Minor repairs shall be borne by the Tenant, while major structural repairs shall be the responsibility of the Landlord.

8. SUBLETTING
The Tenant shall not sublet, assign, or part with the possession of the Demised Premises in whole or in part to anyone else.

${details.specialClauses ? `9. SPECIAL CLAUSES\n${details.specialClauses}\n` : ''}

IN WITNESS WHEREOF, the parties hereto have set their hands to this Agreement on the day and year first above written.

_________________________
Landlord Signature
Name: ${details.landlordName}

_________________________
Tenant Signature
Name: ${details.tenantName}
`;
}
