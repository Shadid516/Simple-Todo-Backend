require('dotenv').config();
const express = require('express');
const app = express();
const todosRouter = require('./routes/todos');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', todosRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});