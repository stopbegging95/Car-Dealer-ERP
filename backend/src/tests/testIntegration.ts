import { EventEmitter } from "events";
import { Readable, Duplex } from "stream";
import app from "../app.js";
import { config } from "../config/env.js";

interface TestResult {
  name: string;
  endpoint: string;
  method: string;
  expectedStatus: number;
  actualStatus: number;
  passed: boolean;
  notes: string;
  durationMs: number;
}

const results: TestResult[] = [];

// Lightweight in-memory HTTP dispatcher (runs in isolated sandboxes without TCP sockets)
function dispatchRequest(
  method: string,
  url: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ statusCode: number; headers: Record<string, any>; body: any }> {
  return new Promise((resolve) => {
    const bodyStr = body ? JSON.stringify(body) : "";
    const reqStream = new Readable({
      read() {
        if (bodyStr) {
          this.push(bodyStr);
        }
        this.push(null);
      },
    }) as any;

    const mockSocket = new Duplex({
      read() {},
      write(chunk, encoding, callback) {
        callback();
      },
    }) as any;
    mockSocket.remoteAddress = "127.0.0.1";
    mockSocket.encrypted = false;

    reqStream.method = method;
    reqStream.url = url;
    reqStream.socket = mockSocket;
    reqStream.connection = mockSocket;
    reqStream.headers = {
      host: "localhost",
      "content-type": "application/json",
      "content-length": Buffer.byteLength(bodyStr).toString(),
      ...headers,
    };
    reqStream.rawHeaders = Object.entries(reqStream.headers).flatMap(([k, v]) => [k, v as string]);

    const resEmitter = new EventEmitter() as any;
    let statusCode = 200;
    const resHeaders: Record<string, any> = {};
    const chunks: Buffer[] = [];

    resEmitter.statusCode = 200;
    resEmitter.setHeader = (name: string, val: any) => {
      resHeaders[name.toLowerCase()] = val;
    };
    resEmitter.getHeader = (name: string) => resHeaders[name.toLowerCase()];
    resEmitter.hasHeader = (name: string) => name.toLowerCase() in resHeaders;
    resEmitter.removeHeader = (name: string) => {
      delete resHeaders[name.toLowerCase()];
    };
    resEmitter.getHeaderNames = () => Object.keys(resHeaders);
    resEmitter.status = (code: number) => {
      statusCode = code;
      resEmitter.statusCode = code;
      return resEmitter;
    };
    resEmitter.writeHead = (code: number, headersObj?: any) => {
      statusCode = code;
      resEmitter.statusCode = code;
      if (headersObj) {
        Object.assign(resHeaders, headersObj);
      }
      return resEmitter;
    };
    resEmitter.write = (chunk: any) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return true;
    };
    resEmitter.end = (chunk: any) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const rawBody = Buffer.concat(chunks).toString("utf-8");
      let parsedBody: any = rawBody;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {}
      resolve({ statusCode, headers: resHeaders, body: parsedBody });
    };

    try {
      app(reqStream, resEmitter);
    } catch (err: any) {
      resolve({ statusCode: 500, headers: {}, body: { error: err.message } });
    }
  });
}

async function runE2ETests() {
  console.log("================================================================================");
  console.log("          CAR DEALS ENTERPRISE ERP - IN-MEMORY INTEGRATION TEST SUITE           ");
  console.log("================================================================================");
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Frontend URL: ${config.frontendUrl}`);
  console.log(`Target VAT Rate: ${config.vatRatePercent}%`);
  console.log("Mode: Direct in-memory HTTP pipeline validation (Zero network dependencies)");
  console.log("--------------------------------------------------------------------------------\n");

  async function testEndpoint(
    name: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: any,
    headers?: Record<string, string>,
    expectedStatus = 200
  ) {
    const start = Date.now();
    const res = await dispatchRequest(method, path, body, headers);
    const durationMs = Date.now() - start;
    const passed = res.statusCode === expectedStatus;

    results.push({
      name,
      endpoint: path,
      method,
      expectedStatus,
      actualStatus: res.statusCode,
      passed,
      notes: passed
        ? "OK"
        : `Expected ${expectedStatus}, received ${res.statusCode}: ${JSON.stringify(res.body)?.substring(0, 80)}`,
      durationMs,
    });

    return res;
  }

  // 1. Health & Server Metadata
  await testEndpoint("API Health & Runtime Check", "GET", "/api/health", undefined, undefined, 200);

  // 2. 404 Catch-All Handler
  await testEndpoint("404 Error Catch-All Handler", "GET", "/api/unknown-service-path", undefined, undefined, 404);

  // 3. Security Headers (Helmet verification)
  const healthCheck = await dispatchRequest("GET", "/api/health");
  const helmetCheckPassed = healthCheck.headers["x-content-type-options"] === "nosniff";
  results.push({
    name: "Helmet HTTP Security Headers (nosniff)",
    endpoint: "/api/health",
    method: "GET",
    expectedStatus: 200,
    actualStatus: helmetCheckPassed ? 200 : 500,
    passed: helmetCheckPassed,
    notes: helmetCheckPassed ? "X-Content-Type-Options: nosniff present" : "Missing security headers",
    durationMs: 1,
  });

  // 4. Protected Route: Audit Logs (Requires JWT)
  await testEndpoint("Protected Audit Logs Rejection (No Token)", "GET", "/api/audit", undefined, undefined, 401);

  // 5. Protected Route: Orders (Requires JWT)
  await testEndpoint("Protected Orders Desk Rejection (No Token)", "GET", "/api/orders", undefined, undefined, 401);

  // 6. Protected Route: Accounting Invoices (Requires JWT)
  await testEndpoint("Protected Accounting Invoices Rejection (No Token)", "GET", "/api/accounting", undefined, undefined, 401);

  // 7. Protected Route: Staff Chat (Requires JWT)
  await testEndpoint("Protected Staff Chat Rejection (No Token)", "GET", "/api/chat/messages", undefined, undefined, 401);

  // 8. Protected Route: HR Employees (Requires JWT)
  await testEndpoint("Protected HR Recruitment Rejection (No Token)", "GET", "/api/hr", undefined, undefined, 401);

  // 9. Protected Route: Inbound Imports (Requires JWT)
  await testEndpoint("Protected Maritime Imports Rejection (No Token)", "GET", "/api/imports", undefined, undefined, 401);

  // 10. Protected Route: Detailing & Recon Pipeline (Requires JWT)
  await testEndpoint("Protected Recon Jobs Rejection (No Token)", "GET", "/api/recon", undefined, undefined, 401);

  // 11. Protected Route: 150-Point Inspection (Requires JWT)
  await testEndpoint("Protected QA Inspections Rejection (No Token)", "GET", "/api/inspection", undefined, undefined, 401);

  // 12. Protected Route: Global Procurement (Requires JWT)
  await testEndpoint("Protected Procurement RFQs Rejection (No Token)", "GET", "/api/procurement", undefined, undefined, 401);

  // 13. Protected Route: Document Vault (Requires JWT)
  await testEndpoint("Protected Document Vault Rejection (No Token)", "GET", "/api/vault", undefined, undefined, 401);

  // 14. Invalid Login Credentials Check
  await testEndpoint(
    "Authentication Rejection for Empty Credentials",
    "POST",
    "/api/auth/login",
    { email: "", password: "" },
    undefined,
    400
  );

  // 15. Invalid / Tampered JWT Session Rejection
  await testEndpoint(
    "Tampered JWT Token Rejection (401 Guard)",
    "GET",
    "/api/audit",
    undefined,
    { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature" },
    401
  );

  // Print Summary Table
  console.log("\n================================================================================");
  console.log("                    END-TO-END INTEGRATION TEST RESULTS MATRIX                  ");
  console.log("================================================================================");
  console.log(
    "| Status | HTTP | Method | Endpoint                              | Duration | Name"
  );
  console.log(
    "|:-------|:-----|:-------|:--------------------------------------|:---------|:-------------------------------------------"
  );
  for (const r of results) {
    const statusIcon = r.passed ? "✅ PASS" : "❌ FAIL";
    const httpCode = r.actualStatus.toString().padEnd(4, " ");
    const method = r.method.padEnd(6, " ");
    const ep = r.endpoint.padEnd(38, " ");
    const dur = `${r.durationMs}ms`.padStart(6, " ");
    console.log(`| ${statusIcon} | ${httpCode} | ${method} | ${ep} | ${dur} | ${r.name}`);
  }
  console.log("================================================================================");

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`Total Integration Tests: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);

  if (failedCount === 0) {
    console.log("🎉 All 14 Core End-to-End Integration Gates PASSED 100%!");
  } else {
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  - [${r.name}]: ${r.notes}`);
    }
  }
  console.log("================================================================================\n");
}

runE2ETests().catch((err) => {
  console.error("Fatal Test Suite Error:", err);
  process.exit(1);
});
