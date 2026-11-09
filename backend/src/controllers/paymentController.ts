import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import axios from "axios";
import { config } from "../config/env.js";
import { Order } from "../models/Order.js";
import { AccountingInvoice } from "../models/AccountingInvoice.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

// Initialize Paystack Payment
export const initializePaystack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderId, email, amountNGN, callbackUrl } = req.body;

    if (!orderId || !email || !amountNGN) {
      throw new ApiError(400, "Order ID, customer email, and amount in NGN are required.");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found.");
    }

    const amountInKobo = Math.round(Number(amountNGN) * 100);

    // Call Paystack API
    const paystackResponse = await axios.post(
      `${config.paystack.baseUrl}/transaction/initialize`,
      {
        email,
        amount: amountInKobo,
        callback_url: callbackUrl || `${config.frontendUrl}/checkout/verify`,
        metadata: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          customerName: order.customerName,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = paystackResponse.data.data;

    // Attach reference to order
    order.paystackReference = data.reference;
    await order.save();

    res.status(200).json(
      new ApiResponse(200, {
        authorizationUrl: data.authorization_url,
        accessCode: data.access_code,
        reference: data.reference,
      }, "Paystack transaction initialized successfully.")
    );
  } catch (error: any) {
    if (error.response?.data?.message) {
      next(new ApiError(error.response.status || 500, error.response.data.message));
    } else {
      next(error);
    }
  }
};

// Verify Paystack Reference
export const verifyPaystack = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reference } = req.params;

    if (!reference) {
      throw new ApiError(400, "Transaction reference is required.");
    }

    const paystackResponse = await axios.get(
      `${config.paystack.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
        },
      }
    );

    const data = paystackResponse.data.data;

    if (data.status === "success") {
      const orderId = data.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          const paidAmountNGN = data.amount / 100;
          order.depositAmountNGN += paidAmountNGN;
          order.transactions.push({
            reference: data.reference,
            amountNGN: paidAmountNGN,
            date: new Date(),
            method: "Paystack Online Card",
            status: "Success",
            channel: data.channel,
          });
          await order.save();
        }
      }
    }

    res.status(200).json(new ApiResponse(200, data, "Transaction verified successfully."));
  } catch (error: any) {
    if (error.response?.data?.message) {
      next(new ApiError(error.response.status || 500, error.response.data.message));
    } else {
      next(error);
    }
  }
};

// Paystack Webhook Handler with HMAC SHA512 Verification
export const handlePaystackWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const hash = crypto
      .createHmac("sha512", config.paystack.secretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      res.status(400).send("Invalid Paystack Signature");
      return;
    }

    const event = req.body;
    if (event.event === "charge.success") {
      const { reference, amount, metadata } = event.data;
      const orderId = metadata?.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          const amountNGN = amount / 100;
          order.depositAmountNGN += amountNGN;
          order.transactions.push({
            reference,
            amountNGN,
            date: new Date(),
            method: "Paystack Online Card",
            status: "Success",
          });
          await order.save();

          await AuditLog.create({
            action: "PAYSTACK_PAYMENT_CONFIRMED",
            module: "PAYMENT",
            resourceId: orderId,
            details: { reference, amountNGN },
          });
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

