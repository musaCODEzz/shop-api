import db from './database';

// ============ TYPES ============

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
    available: boolean;
    createdAt: string;
}

export interface CreateProductInput {
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
}

// ============ VALIDATION FUNCTIONS ============

interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validatePrice(price: any): ValidationResult {
    if (typeof price !== 'number') {
        return { valid: false, error: 'Price must be a number' };
    }
    if (price < 0) {
        return { valid: false, error: 'Price cannot be negative' };
    }
    if (price > 100000) {
        return { valid: false, error: 'Price cannot exceed $100,000' };
    }
    return { valid: true };
}

export function validateStock(stock: any): ValidationResult {
    if (typeof stock !== 'number') {
        return { valid: false, error: 'Stock must be a number' };
    }
    if (!Number.isInteger(stock)) {
        return { valid: false, error: 'Stock must be a whole number' };
    }
    if (stock < 0) {
        return { valid: false, error: 'Stock cannot be negative' };
    }
    return { valid: true };
}

export function validateName(name: any): ValidationResult {
    if (typeof name !== 'string') {
        return { valid: false, error: 'Name must be text' };
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
    }
    if (trimmed.length > 100) {
        return { valid: false, error: 'Name cannot exceed 100 characters' };
    }
    return { valid: true };
}

export function validateCategory(category: any): ValidationResult {
    const validCategories = ['Electronics', 'Accessories', 'Clothing', 'Books'];
    if (!validCategories.includes(category)) {
        return { valid: false, error: `Category must be one of: ${validCategories.join(', ')}` };
    }
    return { valid: true };
}

export function validateDescription(description: any): ValidationResult {
    if (typeof description !== 'string') {
        return { valid: false, error: 'Description must be text' };
    }
    const trimmed = description.trim();
    if (trimmed.length < 5) {
        return { valid: false, error: 'Description must be at least 5 characters' };
    }
    return { valid: true };
}

export function validateCreateProduct(data: any): ValidationResult {
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) {
        return nameValidation;
    }

    const priceValidation = validatePrice(data.price);
    if (!priceValidation.valid) {
        return priceValidation;
    }

    const stockValidation = validateStock(data.stock);
    if (!stockValidation.valid) {
        return stockValidation;
    }

    const categoryValidation = validateCategory(data.category);
    if (!categoryValidation.valid) {
        return categoryValidation;
    }

    const descriptionValidation = validateDescription(data.description);
    if (!descriptionValidation.valid) {
        return descriptionValidation;
    }

    return { valid: true };
}

// ============ DATABASE OPERATIONS ============

// Get all products from database
export function getAllProducts(): Product[] {
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all() as any[];
    return products.map(p => ({ 
        ...p, 
        available: p.available === 1 
    })) as Product[];
}

// Get product by ID from database
export function getProductById(id: number): Product | undefined {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(id) as any;
    
    if (product) {
        // Convert SQLite 1/0 back to true/false
        product.available = product.available === 1;
        return product as Product;
    }
    return undefined;
}
// Create new product in database
export function createProduct(data: CreateProductInput): { success: boolean; data?: Product; error?: string } {
    // Validate input
    const validation = validateCreateProduct(data);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    // Create product with database
    try {
        const stmt = db.prepare(`
            INSERT INTO products (name, price, stock, category, description, available, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        const now = new Date().toISOString();
        const available = data.stock > 0 ? 1 : 0;

        const result = stmt.run(
            data.name.trim(),
            data.price,
            data.stock,
            data.category,
            data.description.trim(),
            available,
            now
        );

        // Get the newly created product
        const newProduct = getProductById(result.lastInsertRowid as number);

        if (!newProduct) {
            return { success: false, error: 'Failed to retrieve created product' };
        }

        return { success: true, data: newProduct };
    } catch (error) {
        return { success: false, error: `Database error: ${error}` };
    }
}

// Update product in database
export function updateProduct(id: number, updates: Partial<CreateProductInput>): { success: boolean; data?: Product; error?: string } {
    // Find product
    const product = getProductById(id);
    if (!product) {
        return { success: false, error: `Product with ID ${id} not found` };
    }

    // Check if anything provided
    // ✅ THE FIX
    if (
        updates.name === undefined && 
        updates.price === undefined && 
        updates.stock === undefined && 
        updates.category === undefined && 
        updates.description === undefined
    ) {
        return { success: false, error: 'Please provide at least one field to update' };
    }

    // Validate each provided field
    if (updates.name !== undefined) {
        const validation = validateName(updates.name);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
    }

    if (updates.price !== undefined) {
        const validation = validatePrice(updates.price);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
    }

    if (updates.stock !== undefined) {
        const validation = validateStock(updates.stock);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
    }

    if (updates.category !== undefined) {
        const validation = validateCategory(updates.category);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
    }

    if (updates.description !== undefined) {
        const validation = validateDescription(updates.description);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
    }

    try {
        // Prepare updates
        const updateFields: string[] = [];
        const values: any[] = [];

        if (updates.name !== undefined) {
            updateFields.push('name = ?');
            values.push(updates.name.trim());
        }

        if (updates.price !== undefined) {
            updateFields.push('price = ?');
            values.push(updates.price);
        }

        if (updates.stock !== undefined) {
            updateFields.push('stock = ?');
            values.push(updates.stock);
        }

        if (updates.category !== undefined) {
            updateFields.push('category = ?');
            values.push(updates.category);
        }

        if (updates.description !== undefined) {
            updateFields.push('description = ?');
            values.push(updates.description.trim());
        }

        // Always update available based on stock
        updateFields.push('available = ?');
        const newStock = updates.stock !== undefined ? updates.stock : product.stock;
        values.push(newStock > 0 ? 1 : 0);

        // Add ID to end of values
        values.push(id);

        // Build and execute query
        const updateSQL = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(updateSQL);
        stmt.run(...values);

        // Get updated product
        const updatedProduct = getProductById(id);
        if (!updatedProduct) {
            return { success: false, error: 'Failed to retrieve updated product' };
        }

        return { success: true, data: updatedProduct };
    } catch (error) {
        return { success: false, error: `Database error: ${error}` };
    }
}

// Delete product from database
export function deleteProduct(id: number): { success: boolean; data?: Product; error?: string } {
    // Find product first (so we can return it)
    const product = getProductById(id);
    if (!product) {
        return { success: false, error: `Product with ID ${id} not found` };
    }

    try {
        // Delete from database
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        stmt.run(id);

        // Return the deleted product
        return { success: true, data: product };
    } catch (error) {
        return { success: false, error: `Database error: ${error}` };
    }
}

// ============ TEST UTILITIES ============
export function resetDatabase() {
    // 1. Delete everything in the table
    db.exec('DELETE FROM products');
    
    // 2. Reset the auto-increment ID counter back to 1
    db.exec("DELETE FROM sqlite_sequence WHERE name='products'");
    
    // 3. Re-seed the initial 4 items so tests have a predictable starting point
    const insertProduct = db.prepare(`
        INSERT INTO products (name, price, stock, category, description, available, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    insertProduct.run('Gaming Laptop', 1299.99, 15, 'Electronics', 'High-performance gaming laptop', 1, now);
    insertProduct.run('Wireless Mouse', 49.99, 100, 'Accessories', 'Compact wireless mouse', 1, now);
    insertProduct.run('USB-C Cable', 15.99, 200, 'Accessories', 'Durable charging cable', 1, now);
    insertProduct.run('Mechanical Keyboard', 129.99, 0, 'Accessories', 'RGB mechanical keyboard', 0, now);
}