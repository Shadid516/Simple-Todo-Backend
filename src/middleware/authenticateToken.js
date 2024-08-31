const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET; // Ensure JWT secret is loaded from environment variables

function authenticateToken(req, res, next) {
    // Extract token from Authorization header using optional chaining
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        };
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
