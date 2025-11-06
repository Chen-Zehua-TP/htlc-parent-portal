// <CONSTANTS>
const sheet = SpreadsheetApp.getActiveSpreadsheet();
const accessSheet = sheet.getSheetByName("Access")
const dataSheet = sheet.getSheetByName('Data')
// documentProperties is defined in utils.js
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

// JWT and HTTP helper functions are now in utils.js

// Handle login-specific logic
function handleLogin(e) {
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