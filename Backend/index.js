
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const port = 3081;

app.use(cors());
app.use(bodyParser.json());

app.use('/', emailRoutes); // Use the email routes

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});  