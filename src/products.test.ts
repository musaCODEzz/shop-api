// ============ IMPORTS ============
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    resetDatabase, // <--- Imported our new reset function!
    type CreateProductInput
} from './products';

// ============ SETUP & TEARDOWN ============

// Before each test, wipe the database and start fresh!
beforeEach(() => {
    resetDatabase();
});

// ============ SECTION 1: GET ALL PRODUCTS ============

describe('getAllProducts()', () => {
    test('should return all products', () => {
        const products = getAllProducts();

        // CHECK: Do we have 4 products?
        expect(products.length).toBe(4);

        // CHECK: Is first product the Gaming Laptop?
        expect(products[0].name).toBe('Gaming Laptop');

        // CHECK: Is last product the Mechanical Keyboard?
        expect(products[3].name).toBe('Mechanical Keyboard');
    });

    test('should return Product objects with all fields', () => {
        const products = getAllProducts();
        const first = products[0];

        expect(first).toHaveProperty('id');
        expect(first).toHaveProperty('name');
        expect(first).toHaveProperty('price');
        expect(first).toHaveProperty('stock');
        expect(first).toHaveProperty('category');
        expect(first).toHaveProperty('description');
        expect(first).toHaveProperty('available');
        expect(first).toHaveProperty('createdAt');
    });
});

// ============ SECTION 2: GET BY ID ============

describe('getProductById()', () => {
    test('should find product by ID', () => {
        const product = getProductById(1);

        expect(product).toBeDefined();
        expect(product?.id).toBe(1);
        expect(product?.name).toBe('Gaming Laptop');
    });

    test('should find product with ID 3', () => {
        const product = getProductById(3);

        expect(product).toBeDefined();
        expect(product?.name).toBe('USB-C Cable');
        expect(product?.price).toBe(15.99);
    });

    test('should return undefined if product not found', () => {
        const product = getProductById(999);
        expect(product).toBeUndefined();
    });

    test('should return undefined for ID 0', () => {
        const product = getProductById(0);
        expect(product).toBeUndefined();
    });
});

// ============ SECTION 3: CREATE PRODUCT ============

describe('createProduct()', () => {
    test('should create valid product', () => {
        const newProduct: CreateProductInput = {
            name: 'iPhone 15',
            price: 999.99,
            stock: 50,
            category: 'Electronics',
            description: 'Latest Apple phone'
        };

        const result = createProduct(newProduct);

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data?.name).toBe('iPhone 15');
        expect(result.data?.price).toBe(999.99);
        expect(result.data?.stock).toBe(50);
        expect(result.data?.id).toBe(5); // 5 because 4 existing + 1 new
        expect(result.data?.available).toBe(true);
    });

    test('should create product with 0 stock', () => {
        const newProduct: CreateProductInput = {
            name: 'Out of Stock Item',
            price: 50,
            stock: 0,
            category: 'Electronics',
            description: 'Item with zero stock'
        };

        const result = createProduct(newProduct);

        expect(result.success).toBe(true);
        expect(result.data?.available).toBe(false);
    });

    test('should reject invalid name (empty)', () => {
        const newProduct: CreateProductInput = {
            name: '',
            price: 50,
            stock: 10,
            category: 'Electronics',
            description: 'Test Description'
        };

        const result = createProduct(newProduct);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });

    test('should reject invalid price (negative)', () => {
        const newProduct: CreateProductInput = {
            name: 'Test Product',
            price: -50,
            stock: 10,
            category: 'Electronics',
            description: 'Negative price test'
        };

        const result = createProduct(newProduct);
        expect(result.success).toBe(false);
    });

    test('should reject invalid category', () => {
        const newProduct: CreateProductInput = {
            name: 'Test Product',
            price: 50,
            stock: 10,
            category: 'InvalidCategory',
            description: 'Invalid category test'
        };

        const result = createProduct(newProduct);
        expect(result.success).toBe(false);
    });

    test('should increment ID for each new product', () => {
        const product1 = createProduct({
            name: 'Product 1',
            price: 50,
            stock: 10,
            category: 'Electronics',
            description: 'First Product'
        });

        const product2 = createProduct({
            name: 'Product 2',
            price: 60,
            stock: 20,
            category: 'Electronics',
            description: 'Second Product'
        });

        expect(product1.data?.id).toBe(5);
        expect(product2.data?.id).toBe(6);
    });
});

// ============ SECTION 4: UPDATE PRODUCT ============

describe('updateProduct()', () => {
    test('should update product price', () => {
        const result = updateProduct(1, { price: 999.99 });

        expect(result.success).toBe(true);
        expect(result.data?.price).toBe(999.99);
        expect(result.data?.name).toBe('Gaming Laptop');
        expect(result.data?.stock).toBe(15); // Matches SQLite initial data
    });

    test('should update product name', () => {
        const result = updateProduct(2, { name: 'Smartphone' });

        expect(result.success).toBe(true);
        expect(result.data?.name).toBe('Smartphone');
        expect(result.data?.price).toBe(49.99); // Matches SQLite initial data
    });

    test('should update multiple fields', () => {
        const updates = {
            name: 'USB Cable Premium',
            price: 19.99,
            stock: 200
        };

        const result = updateProduct(3, updates);

        expect(result.data?.name).toBe('USB Cable Premium');
        expect(result.data?.price).toBe(19.99);
        expect(result.data?.stock).toBe(200);
    });

    test('should update available when stock changes to 0', () => {
        const result = updateProduct(1, { stock: 0 });
        expect(result.data?.available).toBe(false);
    });

    test('should update available when stock changes from 0 to positive', () => {
        const result = updateProduct(4, { stock: 10 }); // ID 4 is the Keyboard with 0 stock
        expect(result.data?.available).toBe(true);
    });

    test('should reject invalid price update', () => {
        const result = updateProduct(1, { price: -50 });
        expect(result.success).toBe(false);
    });

    test('should return error if product not found', () => {
        const result = updateProduct(999, { price: 50 });
        expect(result.success).toBe(false);
        expect(result.error).toContain('not found');
    });

    test('should reject empty update (no fields)', () => {
        const result = updateProduct(1, {});
        expect(result.success).toBe(false);
    });
});

// ============ SECTION 5: DELETE PRODUCT ============

describe('deleteProduct()', () => {
    test('should delete product by ID', () => {
        const before = getAllProducts().length;
        const result = deleteProduct(1);

        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(1);
        expect(result.data?.name).toBe('Gaming Laptop');

        const after = getAllProducts().length;
        expect(after).toBe(before - 1);
    });

    test('should actually remove product from list', () => {
        deleteProduct(2);
        const found = getProductById(2);
        expect(found).toBeUndefined();
    });

    test('should delete last product', () => {
        const result = deleteProduct(4);

        expect(result.success).toBe(true);
        expect(getProductById(4)).toBeUndefined();
        expect(getProductById(1)).toBeDefined();
    });

    test('should return error if product not found', () => {
        const result = deleteProduct(999);
        expect(result.success).toBe(false);
        expect(result.error).toContain('not found');
    });

    test('should return error if already deleted', () => {
        deleteProduct(1);
        const result = deleteProduct(1);
        expect(result.success).toBe(false);
    });
});

// ============ SECTION 6: INTEGRATION TESTS ============

describe('Multiple operations together', () => {
    test('should handle create, update, delete sequence', () => {
        const created = createProduct({
            name: 'Integration Test',
            price: 100,
            stock: 5,
            category: 'Electronics',
            description: 'Testing integration'
        });
        expect(created.success).toBe(true);

        const productId = created.data?.id;

        const found = getProductById(productId!);
        expect(found).toBeDefined();

        const updated = updateProduct(productId!, { price: 150 });
        expect(updated.success).toBe(true);
        expect(updated.data?.price).toBe(150);

        const verified = getProductById(productId!);
        expect(verified?.price).toBe(150);

        const deleted = deleteProduct(productId!);
        expect(deleted.success).toBe(true);

        const gone = getProductById(productId!);
        expect(gone).toBeUndefined();
    });

    test('should maintain data integrity across operations', () => {
        const initialCount = getAllProducts().length;

        createProduct({
            name: 'Test 1',
            price: 50,
            stock: 10,
            category: 'Electronics',
            description: 'Test Product 1'
        });
        createProduct({
            name: 'Test 2',
            price: 60,
            stock: 10,
            category: 'Electronics',
            description: 'Test Product 2'
        });
        createProduct({
            name: 'Test 3',
            price: 70,
            stock: 10,
            category: 'Electronics',
            description: 'Test Product 3'
        });

        expect(getAllProducts().length).toBe(initialCount + 3);

        deleteProduct(5); // Delete the first newly created product
        expect(getAllProducts().length).toBe(initialCount + 2);

        updateProduct(6, { price: 999 }); // Update the second one
        expect(getAllProducts().length).toBe(initialCount + 2);
    });
});

// ============ DATABASE PERSISTENCE TESTS ============

describe('Database Persistence', () => {
    test('should persist product to database', () => {
        const before = getAllProducts().length;
        
        createProduct({
            name: "Persistence Test",
            price: 99.99,
            stock: 1,
            category: "Electronics",
            description: "Testing persistence"
        });
        
        const after = getAllProducts().length;
        expect(after).toBe(before + 1);
    });

    test('should retrieve product by ID from database', () => {
        const product = getProductById(1);
        expect(product).toBeDefined();
        expect(product?.id).toBe(1);
    });

    test('should update persisted product', () => {
        updateProduct(1, { price: 999.99 });
        
        const updated = getProductById(1);
        expect(updated?.price).toBe(999.99);
    });

    test('should delete persisted product', () => {
        const allBefore = getAllProducts();
        const idToDelete = allBefore[allBefore.length - 1].id;
        
        deleteProduct(idToDelete);
        
        const deleted = getProductById(idToDelete);
        expect(deleted).toBeUndefined();
    });
});