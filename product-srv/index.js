const express = require('express');
const app = express();
const port = 5002;

app.get('/products', (req, res) => {
  res.json([{ id: 1, name: 'Laptop' }, { id: 2, name: 'Smartphone' }]);
});

app.listen(port, () => {
  console.log(`Product Service listening at http://localhost:${port}`);
});

