var express = require('express');
var app = express();
var path = require('path');

// Setup
app.use('/', express.static(path.resolve(__dirname + '/')));

app.get('/token', (req, res) => {
  res.send('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
});
app.get('/token/a', (req, res) => {
  res.send('tokenA');
});
app.get('/token/b', (req, res) => {
  res.send('tokenB');
});
app.get('/token/c', (req, res) => {
  res.send('tokenC');
});
app.get('/testapp1/swagger/ui/index', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/index.html'));
});
app.get('/testapp2/swagger/ui/index', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, err => {
  console.info(`Server running on port ${port}`);
});