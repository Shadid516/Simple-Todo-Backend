function validateRequest(req, res, next) {
    if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
    if ((req.method === 'POST' || req.method === 'PUT') && !req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }
    next();
}

module.exports = validateRequest;
