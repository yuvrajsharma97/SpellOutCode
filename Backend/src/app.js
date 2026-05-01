const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());    
app.use(cors());
app.use(cookieParser());


/**
 * Routes
 */

// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", message: "Server is running" });
// });



module.exports = app;