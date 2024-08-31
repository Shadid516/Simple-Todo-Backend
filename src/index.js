require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const authenticateToken = require('./middleware/authenticateToken');
const todosRouter = require('./routes/todos');
const userRoutes = require('./routes/users');
const validateRequest = require('./middleware/requestValidation');
const morgan = require('morgan'); //morgan is a tool that help express devs follow packet routes



const PORT = process.env.PORT || 3000; // Use env port or default to 3000

app.use(morgan('dev')); // Logs requests to the console in a concise format
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(validateRequest); // Middleware to ensure request validation

// Public routes
app.use('/api/users', userRoutes); // User-related routes such as /register and /login

// Protected routes
app.use('/api/todos', authenticateToken, todosRouter); // Apply authentication middleware to /todos routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
