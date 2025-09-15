export interface IPersonalAndInvoicePayload {
  personalDetails: IPersonalDetails;
  invoiceDetails: InvoiceDetails;
}

export interface IPersonalDetails {
  fullName: string;
  email: string;
  phone: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  amount: number;
  invoiceDate: string;
}
