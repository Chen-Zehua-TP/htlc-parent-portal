function handleReceipts(e) {
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

        // Open the spreadsheet and get the ReceiptData sheet
        var sheet = SpreadsheetApp.getActiveSpreadsheet();
        var paymentsheet = sheet.getSheetByName('ReceiptData');
        var data = paymentsheet.getRange(2, 1, paymentsheet.getLastRow() - 1, 6).getValues(); // Get all rows starting from row 2 (excluding header)

        // Filter the data by student ID
        var paymentDetails = data.filter(function(row) {
            return row[2] === targetStudentId; // Filter based on Student ID (column 3 in the spreadsheet)
        }).map(function(row) {
            return {
                date: row[0],  // Date from column 1
                receipt: row[1],  // Receipt from column 2
                courseDescription: row[3],  // Course Description from column 4
                amount: row[4],   // Total from column 5
                remark: row[5]    // Remark from column 6
            };
        });

        if (!paymentDetails || paymentDetails.length === 0) {
            return sendJsonResponse(JSON.stringify({
                status: "Error",
                message: "No receipt records found for student"
            }));
        }

        return sendJsonResponse(JSON.stringify({
            status: "Success",
            data: paymentDetails
        }));

    } catch (error) {
        return sendJsonResponse(JSON.stringify({
            status: "Error",
            message: "Server error"
        }));
    }
}