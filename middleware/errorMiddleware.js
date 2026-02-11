// Error handling middleware function define kar rahe hain
function errorMiddleware(err, req, res, next) {
    console.error(err.stack); // Error ka full stack trace console me print kar rahe hain (debug ke liye)

    res.status(500).json({   // Client ko response bhej rahe hain status 500 ke saath (Internal Server Error)
        success: false,      // Response me success false bata rahe hain
        message: err.message || 'Internal Server Error' // Agar error message hai to bhejo, nahi to default message
    });
}

// Middleware ko export kar rahe hain taake index.js me use ho sake
module.exports = errorMiddleware;
