"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordInvoicePayment = exports.createInvoice = exports.getInvoices = void 0;
const AccountingInvoice_js_1 = require("../models/AccountingInvoice.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getInvoices = async (req, res, next) => {
    try {
        const { paymentStatus, invoiceType, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (paymentStatus)
            filter.paymentStatus = paymentStatus;
        if (invoiceType)
            filter.invoiceType = invoiceType;
        if (search) {
            filter.$or = [
                { invoiceNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { customerTIN: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const invoices = await AccountingInvoice_js_1.AccountingInvoice.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await AccountingInvoice_js_1.AccountingInvoice.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            invoices,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Accounting invoices retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getInvoices = getInvoices;
const createInvoice = async (req, res, next) => {
    try {
        const { invoiceType, referenceId, customerName, customerTIN, customerEmail, customerPhone, customerAddress, lineItems, discountNGN, paymentDueDate, firsTaxFilingPeriod, } = req.body;
        if (!customerName || !customerEmail || !customerPhone || !lineItems || !lineItems.length) {
            throw new apiResponse_js_1.ApiError(400, "Customer details and at least one line item are required.");
        }
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        const newInvoice = await AccountingInvoice_js_1.AccountingInvoice.create({
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
        await AuditLog_js_1.AuditLog.create({
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
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newInvoice, "FIRS VAT tax invoice generated."));
    }
    catch (error) {
        next(error);
    }
};
exports.createInvoice = createInvoice;
const recordInvoicePayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amountPaidNGN } = req.body;
        const invoice = await AccountingInvoice_js_1.AccountingInvoice.findById(id);
        if (!invoice) {
            throw new apiResponse_js_1.ApiError(404, "Invoice not found.");
        }
        invoice.amountPaidNGN += Number(amountPaidNGN || 0);
        await invoice.save();
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, invoice, "Invoice payment recorded."));
    }
    catch (error) {
        next(error);
    }
};
exports.recordInvoicePayment = recordInvoicePayment;
