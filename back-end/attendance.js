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

function cacheAndStore() {
  // Get the student map
  const [studentMap, headers] = mapStudentId();
  if (!studentMap) {
    Logger.log("No student data found.");
    return;
  }

  const cache = CacheService.getScriptCache();
  const props = PropertiesService.getScriptProperties();

  const cacheData = {};
  for (const studentId in studentMap) {
    cacheData[studentId] = JSON.stringify(studentMap[studentId]);
  }
  cache.putAll(cacheData, 21600); // 6 hours

  // Store in PropertiesService (persistent)
  props.setProperties(studentMap);

  cache.put("headers", JSON.stringify(headers))
  props.setProperty("headers", JSON.stringify(headers))

  Logger.log("Student map cached and stored successfully.");
}

function getStudentAttendance(studentID = "R0379") {
  console.time("getRowsOptimized");

  const cache = CacheService.getScriptCache();
  const targetRowsJson = cache.get(studentID);

  // TODO: If no cache, then run cacheAndStore()
  if (!targetRowsJson) {
    Logger.log("No cache found for student: " + studentID);
    return;
  }

  const targetRows = JSON.parse(targetRowsJson); // array of row numbers

  // Retrieve headers from PropertiesService
  const props = PropertiesService.getScriptProperties();
  const headersJson = props.getProperty("headers");
  if (!headersJson) {
    Logger.log("No headers found in properties.");
    return;
  }
  const headers = JSON.parse(headersJson);

  // Build ranges in the form "Sheet1!2:2", "Sheet1!3:3", etc.
  const ranges = targetRows.map(r => `${attendanceSheetName}!${r}:${r}`);

  // Batch get only the necessary rows
  const response = Sheets.Spreadsheets.Values.batchGet(attendanceSheetID, { ranges });

  // Map each row to an object with header keys
  const values = response.valueRanges.map(vr => {
    const row = vr.values ? vr.values[0] : [];
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index] || null;
      return obj;
    }, {});
  });

  console.timeEnd("getRowsOptimized");

  Logger.log(values)

  return values;
}

// Handle POST requests for attendance queries
// Uses validateToken() and sendJsonResponse() from utils.js
function handleAttendance(e) {
  try {
    // Parse the request body
    const params = JSON.parse(e.postData.contents);
    const { token, studentid } = params;

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

    // Use studentid from request, or fall back to token's studentId
    const targetStudentId = studentid || payload.studentId;

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