const auth = require('basic-auth');

function basicAuth(req, res, next) {
  const credentials = auth(req);

  // Check for credentials and validate them [cite: 219, 220, 222]
  if (!credentials || 
      credentials.name !== 'admin' || 
      credentials.pass !== 'password123') 
  {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    // Return the required error message [cite: 223, 224]
    return res.status(401).json({ 
      error: "Unauthorized access. Please provide valid credentials." 
    });
  }
  
  // If valid, proceed to the next middleware/route handler
  next();
}

module.exports = { basicAuth };