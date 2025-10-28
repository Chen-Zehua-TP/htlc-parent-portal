// Shared utilities for Google Apps Script backend

// Properties Service reference
const documentProperties = PropertiesService.getScriptProperties();

// ============================================
// JWT Token Functions
// ============================================

function getJWTSecret() {
  let secret = documentProperties.getProperty("JWT_SECRET");
  if (!secret) {
    secret = Utilities.getUuid();
    documentProperties.setProperty("JWT_SECRET", secret);
  }
  return secret;
}

// Generate JWT Token
function generateToken(studentId) {
  const secret = getJWTSecret();
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60; // 7 days

  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const payload = {
    studentId: studentId,
    iat: now,
    exp: now + expiresIn
  };

  const headerEncoded = Utilities.base64Encode(JSON.stringify(header)).replace(/=/g, "");
  const payloadEncoded = Utilities.base64Encode(JSON.stringify(payload)).replace(/=/g, "");

  const signatureInput = headerEncoded + "." + payloadEncoded;
  const signature = Utilities.computeHmacSha256Signature(signatureInput, secret);
  const signatureEncoded = Utilities.base64Encode(signature).replace(/=/g, "");

  return headerEncoded + "." + payloadEncoded + "." + signatureEncoded;
}

// Validate JWT Token
function validateToken(token) {
  try {
    const secret = getJWTSecret();
    const parts = token.split(".");

    if (parts.length !== 3) return null;

    const headerEncoded = parts[0];
    const payloadEncoded = parts[1];
    const signatureEncoded = parts[2];

    const signatureInput = headerEncoded + "." + payloadEncoded;
    const signature = Utilities.computeHmacSha256Signature(signatureInput, secret);
    const expectedSignature = Utilities.base64Encode(signature).replace(/=/g, "");

    if (signatureEncoded !== expectedSignature) return null;

    const payload = JSON.parse(Utilities.newBlob(Utilities.base64Decode(payloadEncoded + "==")).getDataAsString());

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null; // Token expired

    return payload;
  } catch (error) {
    return null;
  }
}

// ============================================
// HTTP Response Helper
// ============================================

// Helper function to return proper CORS response
function sendJsonResponse(data) {
  const output = ContentService.createTextOutput(data);
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// Handle CORS preflight requests
function doOptions(e) {
  return sendJsonResponse("OK");
}

// ============================================
// Central Router
// ============================================

// Main entry point for all POST requests
// Routes to appropriate handler based on query parameter
function doPost(e) {
  try {
    const route = e.parameter.route || 'login';

    // Route to appropriate handler
    switch (route) {
      case 'login':
        return handleLogin(e);
      case 'attendance':
        return handleAttendance(e);
      default:
        return sendJsonResponse(JSON.stringify({
          status: "Error",
          message: "Invalid route: " + route
        }));
    }
  } catch (error) {
    return sendJsonResponse(JSON.stringify({
      status: "Error",
      message: "Server error: " + error.toString()
    }));
  }
}
