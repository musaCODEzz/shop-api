import express, { Request, Response } from 'express';
import { connectToDatabase, disconnectFromDatabase } from './MongoDb';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    seedInitialData,
    searchProductsByName,
    filterProductsByCategory,
    sortProductsByPrice,
    getPaginatedProducts
} from './mongoProducts';

const app = express();
const PORT = 3000;

// ============ MIDDLEWARE ============

app.use(express.json());

// ============ STARTUP & DATABASE CONNECTION ============

app.listen(PORT, async () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`${'='.repeat(60)}\n`);
    
    try {
        await connectToDatabase();
        await seedInitialData();
        console.log('\n🚀 API Ready to accept requests!\n');
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
});

// ============ GRACEFUL SHUTDOWN ============

process.on('SIGINT', async () => {
    console.log('\n\n📊 Shutting down gracefully...');
    await disconnectFromDatabase();
    process.exit(0);
});

// ============ WELCOME ROUTE ============

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: "Welcome to Shop API with MongoDB Atlas & Mongoose! 🏪☁️",
        database: "MongoDB Atlas (Cloud) with Mongoose ORM",
        endpoints: [
            "GET / - Welcome message",
            "GET /products - Get all products",
            "GET /products/:id - Get one product",
            "POST /products - Create product",
            "PUT /products/:id - Update product",
            "DELETE /products/:id - Delete product"
        ]
    });
});

// ============ GET ROUTES ============

app.get('/products', async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        // 🛡️ Added base 10 and NaN check
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format. ID must be a number." });
        }

        const product = await getProductById(id);
        
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }
        
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// ============ POST ROUTE (CREATE) ============

app.post('/products', async (req: Request, res: Response) => {
    try {
        // 🛡️ Removed the TypeScript lie! Let req.body be completely untyped.
        const data = req.body; 
        const result = await createProduct(data);
        
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        
        res.status(201).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// ============ PUT ROUTE (UPDATE) ============

app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        // 🛡️ Added base 10 and NaN check
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format. ID must be a number." });
        }

        const updates = req.body;
        const result = await updateProduct(id, updates);
        
        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }
        
        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// ============ DELETE ROUTE ============

app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        // 🛡️ Added base 10 and NaN check
        const id = parseInt(String(req.params.id), 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format. ID must be a number." });
        }

        const result = await deleteProduct(id);
        
        if (!result.success) {
            return res.status(404).json({ error: result.error });
        }
        
        res.status(200).json({
            message: "Product deleted successfully",
            data: result.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ============ SEARCH ROUTE (BONUS) ============
app.get('/products/search/:name', async (req: Request, res: Response) => {
    try {
        const searchTerm = String(req.params.name);  // Get from URL
        const products = await searchProductsByName(searchTerm);
        
        res.status(200).json({
            count: products.length,
            search: searchTerm,
            results: products
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to search products' });
    }
});

app.get('/products/category/:category', async (req: Request, res: Response) => {
    try {
        const category = String(req.params.category);  // Get from URL
        const products = await filterProductsByCategory(category);
        
        res.status(200).json({
            count: products.length,
            category: category,
            results: products
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter products by category' });
    }
});

app.get('/products/sorted/:order', async (req: Request, res: Response) => {
    try {
        const order = req.params.order === 'desc' ? 'desc' : 'asc';  // Validate sort order
        const products = await sortProductsByPrice(order);
        
        res.status(200).json({
            count: products.length,
            sortedBy: `price ${order === 'asc' ? 'low to high' : 'high to low'}`,
            results: products
        });
    }catch (error) {
        res.status(500).json({ error: 'Failed to sort products by price' });
    }
});

// PAGINATION - Get products page by page
app.get('/products/page/:page', async (req: Request, res: Response) => {
    try {
        // Get page from URL (e.g., /products/page/2)
        const page = parseInt(String(req.params.page), 10) || 1;
        
        // Get limit from query string (e.g., ?limit=5)
        // If not provided, default is 10
        const limit = parseInt(String(req.query.limit), 10) || 10;
        
        // Call our pagination function
        const result = await getPaginatedProducts(page, limit);
        
        // Send back the result
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to paginate products' });
    }
});