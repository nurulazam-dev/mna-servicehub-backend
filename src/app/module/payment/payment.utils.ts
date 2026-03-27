import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";

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
