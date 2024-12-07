const express = require('express');
const app = express();
const connectDB = require("./config/dbConnect");
const bodyParser = require("body-parser");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const http = require('http');

const server = http.createServer(app);

const corsOptions = {
    origin: '*'
  };

app.use(cors(corsOptions));

console.log('Starting your application...');




app.use("/user", userRoutes)

const port = 3001;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
    
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

