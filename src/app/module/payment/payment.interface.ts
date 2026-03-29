export interface ICreatePaymentPayload {
  requestId: string;
  customerId: string;
}

export interface IInvoiceData {
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  providerName: string;
  amount: number;
  serviceCharge: number;
  productCost: number;
  additionalCost: number;
  transactionId: string;
  paymentDate: string;
}
