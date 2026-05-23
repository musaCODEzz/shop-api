import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    type CreateProductInput
} from './products';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// ============ GET ROUTES ============

// GET all products
app.get('/products', (req, res) => {
    const products = getAllProducts();
    res.status(200).json(products);
});

// GET one product by ID
app.get('/products/:id', (req, res) => {
    // Get ID from URL and convert to number
    const id = parseInt(req.params.id);
    
    // Call function to find product
    const product = getProductById(id);
    
    // If not found, return 404
    if (!product) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
    }
    
    // If found, return product
    res.status(200).json(product);
});

// ============ POST ROUTE (CREATE) ============

// POST create new product
app.post('/products', (req, res) => {
    // Get data from request body
    const data: CreateProductInput = req.body;
    
    // Call function to create
    const result = createProduct(data);
    
    // If failed, return 400
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    
    // If success, return 201 (created) with product
    res.status(201).json(result.data);
});

// ============ PUT ROUTE (UPDATE) ============

// PUT update product
app.put('/products/:id', (req, res) => {
    // Get ID from URL and convert to number
    const id = parseInt(req.params.id);
    
    // Get updates from request body
    const updates = req.body;
    
    // Call function to update
    const result = updateProduct(id, updates);
    
    // If failed, return 400
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    
    // If success, return updated product
    res.status(200).json(result.data);
});

// ============ DELETE ROUTE ============

// DELETE product
app.delete('/products/:id', (req, res) => {
    // Get ID from URL and convert to number
    const id = parseInt(req.params.id);
    
    // Call function to delete
    const result = deleteProduct(id);
    
    // If failed, return 404
    if (!result.success) {
        return res.status(404).json({ error: result.error });
    }
    
    // If success, return deleted product
    res.status(200).json({
        message: "Product deleted successfully",
        data: result.data
    });
});

// ============ WELCOME ROUTE ============

// GET welcome message
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Welcome to Shop API! 🏪",
        endpoints: [
            "GET /products - Get all products",
            "GET /products/:id - Get one product",
            "POST /products - Create product",
            "PUT /products/:id - Update product",
            "DELETE /products/:id - Delete product"
        ]
    });
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   GET    http://localhost:${PORT}/products`);
    console.log(`   GET    http://localhost:${PORT}/products/:id`);
    console.log(`   POST   http://localhost:${PORT}/products`);
    console.log(`   PUT    http://localhost:${PORT}/products/:id`);
    console.log(`   DELETE http://localhost:${PORT}/products/:id`);
});