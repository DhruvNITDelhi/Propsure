export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(
  value: string | undefined | null,
  fieldName: string
): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return { field: fieldName, message: `${fieldName} is required` };
  }
  return null;
}

export function validateNumeric(
  value: string | undefined | null,
  fieldName: string,
  options?: { min?: number; max?: number }
): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  const num = parseFloat(value.replace(/,/g, ''));
  if (isNaN(num)) {
    return { field: fieldName, message: `${fieldName} must be a number` };
  }

  if (options?.min !== undefined && num < options.min) {
    return { field: fieldName, message: `${fieldName} must be at least ${options.min}` };
  }

  if (options?.max !== undefined && num > options.max) {
    return { field: fieldName, message: `${fieldName} must be at most ${options.max}` };
  }

  return null;
}

export function validateRentalForm(data: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];

  const requiredFields = [
    { key: 'landlordName', label: 'Landlord Name' },
    { key: 'tenantName', label: 'Tenant Name' },
    { key: 'address', label: 'Property Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'rent', label: 'Monthly Rent' },
    { key: 'deposit', label: 'Security Deposit' },
    { key: 'duration', label: 'Agreement Duration' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'noticePeriod', label: 'Notice Period' },
  ];

  for (const field of requiredFields) {
    const err = validateRequired(data[field.key], field.label);
    if (err) errors.push(err);
  }

  if (data.rent) {
    const rentErr = validateNumeric(data.rent, 'Monthly Rent', { min: 1 });
    if (rentErr) errors.push(rentErr);
  }

  if (data.deposit) {
    const depositErr = validateNumeric(data.deposit, 'Security Deposit', { min: 0 });
    if (depositErr) errors.push(depositErr);
  }

  return errors;
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

export function parseCurrencyInput(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
