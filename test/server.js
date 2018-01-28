var express = require('express');
var app = express();
var path = require('path');

// Setup
app.use('/', express.static(path.resolve(__dirname + '/')));

app.get('/token', (req, res) => {
  res.send('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, err => {
  console.info(`Server running on port ${port}`);
});