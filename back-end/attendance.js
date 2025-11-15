const attendanceSheetID = '1UnWhJktyP0AMtgeoOx4p3IzSIdZrqi_ywPDxj_qXHqA';
const attendanceSheet = SpreadsheetApp.openById(attendanceSheetID);

const attendanceSheetName = 'AttdData';
const attendanceData = attendanceSheet.getSheetByName(attendanceSheetName);

function mapStudentId() {
  // Get all data
  const data = attendanceData.getDataRange().getValues();
  const headers = data[0]

  const studentIdIndex = headers.indexOf("StudentID");

  if (studentIdIndex === -1) {
    Logger.log("No 'StudentID' column found.");
    return;
  }

  const studentMap = {};

  // Loop through rows (skip header)
  for (let i = 1; i < data.length; i++) {
    const studentId = data[i][studentIdIndex];
    if (!studentId) continue;

    if (!studentMap[studentId]) {
      studentMap[studentId] = [];
    }

    // Push entire row (or customize to only include certain columns)
    studentMap[studentId].push(String(i+1));
  }

  return [studentMap, headers.map(header => header.toLowerCase())];
}

function storeMapStudentId() {
  // Get the student map
  const [studentMap, headers] = mapStudentId();
  if (!studentMap) {
    Logger.log("No student data found.");
    return;
  }

  const docProps = PropertiesService.getDocumentProperties();

  const propsToStore = {};
  for (const studentId in studentMap) {
    propsToStore[studentId] = JSON.stringify(studentMap[studentId]);
  }
  
  // Store all student attendance rows in document properties
  docProps.setProperties(propsToStore);

  // Store headers in document properties
  docProps.setProperty("headers", JSON.stringify(headers));

  Logger.log("Student map stored in document properties successfully.");
}

function getStudentAttendance(studentID = "S0931") {
  console.time("getRowsOptimized");

  const docProps = PropertiesService.getDocumentProperties();
  let targetRowsJson = docProps.getProperty(studentID);

  // If no data found, populate the document properties
  if (!targetRowsJson) {
    Logger.log("No data found for student: " + studentID + ". Running storeMapStudentId()...");
    storeMapStudentId();
    // Try again after storing
    targetRowsJson = docProps.getProperty(studentID);
    if (!targetRowsJson) {
      Logger.log("Still no data found for student: " + studentID);
      return null;
    }
  }

  // Parse the JSON string to get array of row numbers
  let targetRows;
  try {
    targetRows = JSON.parse(targetRowsJson);
    if (!Array.isArray(targetRows) || targetRows.length === 0) {
      Logger.log("Invalid or empty row data for student: " + studentID);
      return null;
    }
  } catch (e) {
    Logger.log("Error parsing row data for student " + studentID + ": " + e.toString());
    return null;
  }

  // Retrieve headers from Document Properties
  const headersJson = docProps.getProperty("headers");
  if (!headersJson) {
    Logger.log("No headers found in document properties.");
    return null;
  }
  
  let headers;
  try {
    headers = JSON.parse(headersJson);
    if (!Array.isArray(headers) || headers.length === 0) {
      Logger.log("Invalid or empty headers data");
      return null;
    }
  } catch (e) {
    Logger.log("Error parsing headers: " + e.toString());
    return null;
  }

  // Build ranges in the form "AttdData!2:2", "AttdData!5:5", etc.
  const ranges = targetRows.map(r => `${attendanceSheetName}!${r}:${r}`);

  // Batch get only the necessary rows
  const response = Sheets.Spreadsheets.Values.batchGet(attendanceSheetID, { ranges });

  if (!response.valueRanges || response.valueRanges.length === 0) {
    Logger.log("No data returned from sheet for ranges: " + ranges.join(", "));
    return null;
  }

  // Map each row to an object with header keys
  const values = response.valueRanges.map(vr => {
    const row = vr.values ? vr.values[0] : [];
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index] || null;
      return obj;
    }, {});
  });

  console.timeEnd("getRowsOptimized");

  Logger.log("Retrieved " + values.length + " records for student: " + studentID);
  Logger.log(values);

  return values;
}

// Handle POST requests for attendance queries
// Uses validateToken() and sendJsonResponse() from utils.js
function handleAttendance(e) {
  try {
    // Parse the request body
    const params = JSON.parse(e.postData.contents);
    const { token } = params;

    // Validate token
    if (!token) {
      return sendJsonResponse(JSON.stringify({
        status: "Error",
        message: "Token is required"
      }));
    }

    const payload = validateToken(token);
    if (!payload) {
      return sendJsonResponse(JSON.stringify({
        status: "Error",
        message: "Invalid or expired token"
      }));
    }

    // Extract studentId from verified token only
    const targetStudentId = payload.studentId;

    // Get attendance data
    const attendanceRecords = getStudentAttendance(targetStudentId);

    if (!attendanceRecords) {
      return sendJsonResponse(JSON.stringify({
        status: "Error",
        message: "No attendance records found for student: " + targetStudentId
      }));
    }

    return sendJsonResponse(JSON.stringify({
      status: "Success",
      data: attendanceRecords
    }));

  } catch (error) {
    return sendJsonResponse(JSON.stringify({
      status: "Error",
      message: "Server error: " + error.toString()
    }));
  }
}