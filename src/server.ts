import express from 'express';
import { getAllProducts } from './products';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

app.get('/products', (req, res) => {
    const allProducts = getAllProducts();
    res.status(200).json(allProducts);
});

// Test route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Shop API! 🏪" });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📦 Visit http://localhost:${PORT}/products to see products`);

});