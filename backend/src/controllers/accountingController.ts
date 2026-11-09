import { Request, Response, NextFunction } from "express";
import { AccountingInvoice } from "../models/AccountingInvoice.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { paymentStatus, invoiceType, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (invoiceType) filter.invoiceType = invoiceType;
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search as string, $options: "i" } },
        { customerName: { $regex: search as string, $options: "i" } },
        { customerTIN: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const invoices = await AccountingInvoice.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AccountingInvoice.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        invoices,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Accounting invoices retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      invoiceType,
      referenceId,
      customerName,
      customerTIN,
      customerEmail,
      customerPhone,
      customerAddress,
      lineItems,
      discountNGN,
      paymentDueDate,
      firsTaxFilingPeriod,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !lineItems || !lineItems.length) {
      throw new ApiError(400, "Customer details and at least one line item are required.");
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const newInvoice = await AccountingInvoice.create({
      invoiceNumber,
      invoiceType: invoiceType || "Vehicle Sale",
      referenceId: referenceId || "",
      customerName,
      customerTIN: customerTIN || "",
      customerEmail: customerEmail.toLowerCase(),
      customerPhone,
      customerAddress: customerAddress || "",
      lineItems,
      firsVatRatePercent: 7.5,
      discountNGN: Number(discountNGN || 0),
      paymentDueDate: paymentDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      firsTaxFilingPeriod: firsTaxFilingPeriod || "2026-Q1",
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "accounting",
      action: "ACCOUNTING_INVOICE_GENERATED",
      module: "ACCOUNTING",
      resourceId: newInvoice._id.toString(),
      details: {
        invoiceNumber,
        grandTotal: newInvoice.grandTotalNGN,
        vat7_5: newInvoice.vatAmountNGN,
      },
    });

    res.status(201).json(new ApiResponse(201, newInvoice, "FIRS VAT tax invoice generated."));
  } catch (error) {
    next(error);
  }
};

export const recordInvoicePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { amountPaidNGN } = req.body;

    const invoice = await AccountingInvoice.findById(id);
    if (!invoice) {
      throw new ApiError(404, "Invoice not found.");
    }

    invoice.amountPaidNGN += Number(amountPaidNGN || 0);
    await invoice.save();

    res.status(200).json(new ApiResponse(200, invoice, "Invoice payment recorded."));
  } catch (error) {
    next(error);
  }
};

