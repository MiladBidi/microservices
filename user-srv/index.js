const express = require('express');
const app = express();
const port = 5001;

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]);
});

app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});
