// <CONSTANTS>
const sheet = SpreadsheetApp.openById('1g-5UNu-MZ7AEe0tyreoArrkKsJpY0jmv8Yg6tix4yME')
const accessSheet = sheet.getSheetByName("Access")
const dataSheet = sheet.getSheetByName('Data')
const documentProperties = PropertiesService.getScriptProperties()

function reimportStudentsInfo() {
  mapStudentPins()
  getStudentsData()
}
// Import
function mapStudentPins() {
  const startingRow = 2
  const lastRow = accessSheet.getLastRow();
  
  // Get data from columns A and B, starting from row 2
  const data = accessSheet.getRange(startingRow, 1, lastRow - 1, startingRow).getValues();

  const mapping = {};

  data.forEach(row => {
    const key = row[0]; // Column A
    const value = row[1]; // Column B
    if (key !== "") {
      mapping[key] = value;
    }
  });
  
  // If you want to return or use the mapping object:
  documentProperties.setProperty("studentPins", JSON.stringify(mapping))
}

function getStudentsData() {
  var fromData = dataSheet.getDataRange().getValues();
  var mappedData = {} // studentId(String): studentData(Array)

    // Start from the second row (index 1) to exclude the first row (index 0)
  for (var i = 1; i < fromData.length; i++) {
    mappedData[fromData[i][0]] = fromData[i]; // Add each row to the JSON array
  }

  documentProperties.setProperty("studentsData", JSON.stringify(mappedData))

  // Logger.log(JSON.parse(documentProperties.getProperty("studentsData")))
}

function onEdit() {
  reimportStudentsInfo()
}

// Create (new row)

// Delete (remove row)

// Update (onEdit)


// Search function to validate student ID and access key
function searchtxt(givenUser, givenPass) {
  console.time('executionTime');
  const studentPinsString = documentProperties.getProperty("studentPins")
  const studentsDataString = documentProperties.getProperty("studentsData")
  const studentPins = JSON.parse(studentPinsString)
  const studentsData = JSON.parse(studentsDataString)

  // Start measuring the time
  const storedPass = studentPins[givenUser]

  if(storedPass==givenPass){
    const studentData = studentsData[givenUser]
    const token = generateToken(givenUser) // Generate JWT token
    
    console.timeEnd('executionTime');
    
    return JSON.stringify({ 
      status: "Success", 
      data: studentData,
      token: token // Include token in response
    });
  } else {
    // wrong pass
    return JSON.stringify({ status: "Error", message: "Wrong Access Key" });
  }
}

// JWT Helper functions
function getJWTSecret() {
  let secret = documentProperties.getProperty("JWT_SECRET")
  if (!secret) {
    secret = Utilities.getUuid()
    documentProperties.setProperty("JWT_SECRET", secret)
  }
  return secret
}

// Generate JWT Token
function generateToken(studentId) {
  const secret = getJWTSecret()
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = 7 * 24 * 60 * 60 // 7 days
  
  const header = {
    alg: "HS256",
    typ: "JWT"
  }
  
  const payload = {
    studentId: studentId,
    iat: now,
    exp: now + expiresIn
  }
  
  const headerEncoded = Utilities.base64Encode(JSON.stringify(header)).replace(/=/g, "")
  const payloadEncoded = Utilities.base64Encode(JSON.stringify(payload)).replace(/=/g, "")
  
  const signatureInput = headerEncoded + "." + payloadEncoded
  const signature = Utilities.computeHmacSha256Signature(signatureInput, secret)
  const signatureEncoded = Utilities.base64Encode(signature).replace(/=/g, "")
  
  return headerEncoded + "." + payloadEncoded + "." + signatureEncoded
}

// Validate JWT Token
function validateToken(token) {
  try {
    const secret = getJWTSecret()
    const parts = token.split(".")
    
    if (parts.length !== 3) return null
    
    const headerEncoded = parts[0]
    const payloadEncoded = parts[1]
    const signatureEncoded = parts[2]
    
    const signatureInput = headerEncoded + "." + payloadEncoded
    const signature = Utilities.computeHmacSha256Signature(signatureInput, secret)
    const expectedSignature = Utilities.base64Encode(signature).replace(/=/g, "")
    
    if (signatureEncoded !== expectedSignature) return null
    
    const payload = JSON.parse(Utilities.newBlob(Utilities.base64Decode(payloadEncoded + "==")).getDataAsString())
    
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) return null // Token expired
    
    return payload
  } catch (error) {
    return null
  }
}

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

// Handle POST requests for login authentication
function doPost(e) {
  try {
    // Parse the request body
    const params = JSON.parse(e.postData.contents);
    const { studentid, pincode, token } = params;

    // If token provided, validate it instead of username/password
    if (token) {
      const payload = validateToken(token)
      if (payload) {
        const studentsDataString = documentProperties.getProperty("studentsData")
        const studentsData = JSON.parse(studentsDataString)
        const studentData = studentsData[payload.studentId]
        return sendJsonResponse(JSON.stringify({
          status: "Success",
          data: studentData,
          token: token // Return same token
        }));
      } else {
        return sendJsonResponse(JSON.stringify({
          status: "Error",
          message: "Invalid or expired token"
        }));
      }
    }

    // Normal login flow
    if (!studentid || !pincode) {
      return sendJsonResponse(JSON.stringify({
        status: "Error",
        message: "Student ID and PIN are required"
      }));
    }

    // Call the validation function
    const result = searchtxt(studentid, pincode);

    return sendJsonResponse(result);
  } catch (error) {
    return sendJsonResponse(JSON.stringify({
      status: "Error",
      message: "Server error: " + error.toString()
    }));
  }
}