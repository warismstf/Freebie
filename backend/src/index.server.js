const express = require('express');
const env = require('dotenv');
const app = express();
const PORT = process.env.PORT || 2000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');

// Environment variable or you can say constants
env.config();


// mongodb connection from mongodb compass
mongoose.set("strictQuery", false);
mongoose.connect(
    "mongodb+srv://warismustf:Oy7SdSL5DdRNTtGf@e-commerce.zmprlyt.mongodb.net/test",
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log(err);
});


// Parsing application
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

