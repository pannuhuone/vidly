
// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId in not provided
// Return 400 if movieId in not provided
// Return 404 if rental found this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set return date
// Calculate rental fee
// Increase the stock
// Return the rental