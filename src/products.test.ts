// ============ IMPORTS ============
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    type CreateProductInput
} from './products';

// ============ SETUP & TEARDOWN ============

// Before each test, reset products to original state
beforeEach(() => {
    resetProducts();
});

// ============ SECTION 1: GET ALL PRODUCTS ============

describe('getAllProducts()', () => {
    test('should return all products', () => {
        // ACTION: Call function
        const products = getAllProducts();

        // CHECK: Do we have 4 products?
        expect(products.length).toBe(4);

        // CHECK: Is first product Laptop?
        expect(products[0].name).toBe('Laptop');

        // CHECK: Is last product Coffee Maker?
        expect(products[3].name).toBe('Coffee Maker');
    });

    test('should return Product objects with all fields', () => {
        // ACTION: Call function
        const products = getAllProducts();

        // GET first product
        const first = products[0];

        // CHECK: Does it have all required fields?
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
        // ACTION: Get product with ID 1
        const product = getProductById(1);

        // CHECK: Did we find it?
        expect(product).toBeDefined();

        // CHECK: Is it the right product?
        expect(product?.id).toBe(1);
        expect(product?.name).toBe('Laptop');
    });

    test('should find product with ID 3', () => {
        // ACTION: Get product with ID 3
        const product = getProductById(3);

        // CHECK: Did we find it?
        expect(product).toBeDefined();

        // CHECK: Is it Headphones?
        expect(product?.name).toBe('Headphones');
        expect(product?.price).toBe(199.99);
    });

    test('should return undefined if product not found', () => {
        // ACTION: Try to get non-existent product
        const product = getProductById(999);

        // CHECK: Is it undefined?
        expect(product).toBeUndefined();
    });

    test('should return undefined for ID 0', () => {
        // ACTION: Try to get product with ID 0
        const product = getProductById(0);

        // CHECK: Is it undefined?
        expect(product).toBeUndefined();
    });
});

// ============ SECTION 3: CREATE PRODUCT ============

describe('createProduct()', () => {
    test('should create valid product', () => {
        // SETUP: Create test data
        const newProduct: CreateProductInput = {
            name: 'iPhone 15',
            price: 999.99,
            stock: 50,
            category: 'Electronics',
            description: 'Latest Apple phone'
        };

        // ACTION: Create the product
        const result = createProduct(newProduct);

        // CHECK: Was it successful?
        expect(result.success).toBe(true);

        // CHECK: Does result have data?
        expect(result.data).toBeDefined();

        // CHECK: Is data correct?
        expect(result.data?.name).toBe('iPhone 15');
        expect(result.data?.price).toBe(999.99);
        expect(result.data?.stock).toBe(50);

        // CHECK: Was ID assigned?
        expect(result.data?.id).toBe(5); // 5 because 4 existing + 1 new

        // CHECK: Is available set correctly?
        expect(result.data?.available).toBe(true); // true because stock > 0
    });

    test('should create product with 0 stock', () => {
        // SETUP: Product with no stock
        const newProduct: CreateProductInput = {
            name: 'Out of Stock Item',
            price: 50,
            stock: 0,
            category: 'Electronics',
            description: 'Item with zero stock'
        };

        // ACTION: Create it
        const result = createProduct(newProduct);

        // CHECK: Was successful?
        expect(result.success).toBe(true);

        // CHECK: Is available false when stock is 0?
        expect(result.data?.available).toBe(false);
    });

    test('should reject invalid name (empty)', () => {
        // SETUP: Empty name
        const newProduct: CreateProductInput = {
            name: '',
            price: 50,
            stock: 10,
            category: 'Electronics',
            description: 'Test'
        };

        // ACTION: Try to create
        const result = createProduct(newProduct);

        // CHECK: Did it fail?
        expect(result.success).toBe(false);

        // CHECK: Is there an error message?
        expect(result.error).toBeDefined();
    });

    test('should reject invalid price (negative)', () => {
        // SETUP: Negative price
        const newProduct: CreateProductInput = {
            name: 'Test Product',
            price: -50,
            stock: 10,
            category: 'Electronics',
            description: 'Negative price test'
        };

        // ACTION: Try to create
        const result = createProduct(newProduct);

        // CHECK: Did it fail?
        expect(result.success).toBe(false);
    });

    test('should reject invalid category', () => {
        // SETUP: Wrong category
        const newProduct: CreateProductInput = {
            name: 'Test Product',
            price: 50,
            stock: 10,
            category: 'InvalidCategory', // Not in allowed list
            description: 'Invalid category test'
        };

        // ACTION: Try to create
        const result = createProduct(newProduct);

        // CHECK: Did it fail?
        expect(result.success).toBe(false);
    });

    test('should increment ID for each new product', () => {
        // CREATE first product
        const product1 = createProduct({
            name: 'Product 1',
            price: 50,
            stock: 10,
            category: 'Electronics',
            description: 'First'
        });

        // CREATE second product
        const product2 = createProduct({
            name: 'Product 2',
            price: 60,
            stock: 20,
            category: 'Electronics',
            description: 'Second'
        });

        // CHECK: Did IDs increment?
        expect(product1.data?.id).toBe(5); // First new: ID 5
        expect(product2.data?.id).toBe(6); // Second new: ID 6
    });
});

// ============ SECTION 4: UPDATE PRODUCT ============

describe('updateProduct()', () => {
    test('should update product price', () => {
        // ACTION: Update price of product 1
        const result = updateProduct(1, { price: 999.99 });

        // CHECK: Was successful?
        expect(result.success).toBe(true);

        // CHECK: Is price updated?
        expect(result.data?.price).toBe(999.99);

        // CHECK: Are other fields unchanged?
        expect(result.data?.name).toBe('Laptop');
        expect(result.data?.stock).toBe(10);
    });

    test('should update product name', () => {
        // ACTION: Update name of product 2
        const result = updateProduct(2, { name: 'Smartphone' });

        // CHECK: Was successful?
        expect(result.success).toBe(true);

        // CHECK: Is name updated?
        expect(result.data?.name).toBe('Smartphone');

        // CHECK: Price unchanged?
        expect(result.data?.price).toBe(449.99);
    });

    test('should update multiple fields', () => {
        // SETUP: Multiple updates
        const updates = {
            name: 'USB Cable Premium',
            price: 19.99,
            stock: 200
        };

        // ACTION: Update product 3
        const result = updateProduct(3, updates);

        // CHECK: All fields updated?
        expect(result.data?.name).toBe('USB Cable Premium');
        expect(result.data?.price).toBe(19.99);
        expect(result.data?.stock).toBe(200);
    });

    test('should update available when stock changes to 0', () => {
        // ACTION: Set stock to 0
        const result = updateProduct(1, { stock: 0 });

        // CHECK: Is available false?
        expect(result.data?.available).toBe(false);
    });

    test('should update available when stock changes from 0 to positive', () => {
        // FIRST: Create product with 0 stock
        createProduct({
            name: 'Test',
            price: 50,
            stock: 0,
            category: 'Electronics',
            description: 'Test product'
        });

        // THEN: Get the ID (should be 5)
        const newProduct = getProductById(5);
        expect(newProduct?.available).toBe(false);

        // ACTION: Update stock to 10
        const result = updateProduct(5, { stock: 10 });

        // CHECK: Is available now true?
        expect(result.data?.available).toBe(true);
    });

    test('should reject invalid price update', () => {
        // ACTION: Try to set price to -50
        const result = updateProduct(1, { price: -50 });

        // CHECK: Did it fail?
        expect(result.success).toBe(false);
    });

    test('should return error if product not found', () => {
        // ACTION: Try to update non-existent product
        const result = updateProduct(999, { price: 50 });

        // CHECK: Did it fail?
        expect(result.success).toBe(false);

        // CHECK: Is error message correct?
        expect(result.error).toContain('not found');
    });

    test('should reject empty update (no fields)', () => {
        // ACTION: Try to update with no fields
        const result = updateProduct(1, {});

        // CHECK: Did it fail?
        expect(result.success).toBe(false);
    });
});

// ============ SECTION 5: DELETE PRODUCT ============

describe('deleteProduct()', () => {
    test('should delete product by ID', () => {
        // SETUP: Get count before delete
        const before = getAllProducts().length;

        // ACTION: Delete product 1
        const result = deleteProduct(1);

        // CHECK: Was successful?
        expect(result.success).toBe(true);

        // CHECK: Did it return the deleted product?
        expect(result.data?.id).toBe(1);
        expect(result.data?.name).toBe('Laptop');

        // CHECK: Is product count reduced?
        const after = getAllProducts().length;
        expect(after).toBe(before - 1);
    });

    test('should actually remove product from list', () => {
        // ACTION: Delete product 2
        deleteProduct(2);

        // CHECK: Can we find it again?
        const found = getProductById(2);
        expect(found).toBeUndefined();
    });

    test('should delete last product', () => {
        // ACTION: Delete product 4 (last one)
        const result = deleteProduct(4);

        // CHECK: Was successful?
        expect(result.success).toBe(true);

        // CHECK: Is it gone?
        expect(getProductById(4)).toBeUndefined();

        // CHECK: Other products still exist?
        expect(getProductById(1)).toBeDefined();
    });

    test('should return error if product not found', () => {
        // ACTION: Try to delete non-existent product
        const result = deleteProduct(999);

        // CHECK: Did it fail?
        expect(result.success).toBe(false);

        // CHECK: Is error message correct?
        expect(result.error).toContain('not found');
    });

    test('should return error if already deleted', () => {
        // DELETE product 1
        deleteProduct(1);

        // ACTION: Try to delete it again
        const result = deleteProduct(1);

        // CHECK: Did it fail?
        expect(result.success).toBe(false);
    });
});

// ============ SECTION 6: INTEGRATION TESTS ============

describe('Multiple operations together', () => {
    test('should handle create, update, delete sequence', () => {
        // STEP 1: Create new product
        const created = createProduct({
            name: 'Integration Test',
            price: 100,
            stock: 5,
            category: 'Electronics',
            description: 'Testing integration'
        });
        expect(created.success).toBe(true);

        const productId = created.data?.id;

        // STEP 2: Verify it was created
        const found = getProductById(productId!);
        expect(found).toBeDefined();

        // STEP 3: Update it
        const updated = updateProduct(productId!, { price: 150 });
        expect(updated.success).toBe(true);
        expect(updated.data?.price).toBe(150);

        // STEP 4: Verify update
        const verified = getProductById(productId!);
        expect(verified?.price).toBe(150);

        // STEP 5: Delete it
        const deleted = deleteProduct(productId!);
        expect(deleted.success).toBe(true);

        // STEP 6: Verify deletion
        const gone = getProductById(productId!);
        expect(gone).toBeUndefined();
    });

    test('should maintain data integrity across operations', () => {
        // GET initial count
        const initialCount = getAllProducts().length;

        // CREATE 3 products
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

        // Check count increased by 3
        expect(getAllProducts().length).toBe(initialCount + 3);

        // DELETE 1 product
        deleteProduct(5); // First new product

        // Check count decreased by 1
        expect(getAllProducts().length).toBe(initialCount + 2);

        // UPDATE 1 product
        updateProduct(6, { price: 999 });

        // Check count didn't change
        expect(getAllProducts().length).toBe(initialCount + 2);
    });
});