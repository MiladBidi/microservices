const express = require('express');
const app = express();
const port = 5003;

app.get('/orders', (req, res) => {
  res.json([{ orderId: 1, product: 'Laptop', quantity: 1 }, { orderId: 2, product: 'Smartphone', quantity: 2 }]);
});

app.listen(port, () => {
  console.log(`Order Service listening at http://localhost:${port}`);
});

