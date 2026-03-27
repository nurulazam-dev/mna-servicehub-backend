/* eslint-disable @typescript-eslint/no-explicit-any */
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import PDFDocument from "pdfkit";

export const createStripeSession = async (data: {
  amount: number;
  requestId: string;
  paymentId: string;
  customerEmail: string;
  serviceName: string;
}) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: data.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: data.serviceName,
            description: `Payment for Service Request ID: ${data.requestId}`,
          },
          unit_amount: Math.round(data.amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      requestId: data.requestId,
      paymentId: data.paymentId,
    },
    success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/payment/cancel`,
  });
};

export const generateInvoicePdf = async (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.on("error", (error) => {
      reject(error);
    });

    doc.fontSize(20).text("MNA ServiceHub", { align: "right" });
    doc.fontSize(10).text("Your Trusted Service Partner", { align: "right" });
    doc.moveDown();

    doc.fontSize(25).font("Helvetica-Bold").text("INVOICE", { align: "left" });
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(10).font("Helvetica-Bold").text("Bill To:");
    doc.font("Helvetica").text(`Name: ${data.customerName}`);
    doc.text(`Email: ${data.customerEmail}`);
    doc.moveDown();

    doc.font("Helvetica-Bold").text("Service Details:");
    doc.font("Helvetica").text(`Service: ${data.serviceName}`);
    doc.text(`Provider: ${data.providerName}`);
    doc.text(`Transaction ID: ${data.transactionId}`);
    doc.moveDown();

    const tableTop = doc.y;
    doc.font("Helvetica-Bold").text("Description", 50, tableTop);
    doc.text("Amount (BDT)", 450, tableTop, { align: "right" });
    doc
      .moveTo(50, doc.y + 2)
      .lineTo(550, doc.y + 2)
      .stroke();

    let currentY = doc.y + 15;
    const drawRow = (label: string, value: number) => {
      doc.font("Helvetica").text(label, 50, currentY);
      doc.text(`${value.toFixed(2)}`, 450, currentY, { align: "right" });
      currentY += 20;
    };

    drawRow("Service Charge", data.serviceCharge);
    drawRow("Product/Material Cost", data.productCost);
    drawRow("Additional Cost", data.additionalCost);

    doc.moveTo(350, currentY).lineTo(550, currentY).stroke();
    currentY += 10;

    doc.font("Helvetica-Bold").fontSize(12).text("Total Paid:", 350, currentY);
    doc.text(`${data.amount.toFixed(2)} BDT`, 450, currentY, {
      align: "right",
    });

    doc.end();
  });
};
