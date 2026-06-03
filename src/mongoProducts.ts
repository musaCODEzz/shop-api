import Product, { IProduct } from './models/Product';

export interface CreateProductInput{
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
}

interface ValidationResult{
    valid: boolean;
    error?: string;
}

export function validatePrice(price: unknown): ValidationResult{
    if(typeof price !== 'number'){
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
export function validateStock(stock: unknown): ValidationResult{
    if(typeof stock !== 'number'){
        return { valid: false, error: 'Stock must be a number' };
    }
    if(!Number.isInteger(stock)){
        return { valid: false, error: 'Stock must be an integer' };
    }
    if (stock < 0) {
        return { valid: false, error: 'Stock cannot be negative' };
    }
    return { valid: true };
}

export function validateName(name: unknown): ValidationResult{
    if(typeof name !== 'string'){
        return { valid: false, error: 'Name must be a string' };
    }
    const trimmed = name.trim();
    if(trimmed.length <2){
        return { valid: false, error: 'Name must be at least 2 characters long' };
    }
    if(trimmed.length > 100){
        return { valid: false, error: 'Name cannot exceed 100 characters' };
    }
    return { valid: true };
}
export function validateCategory(category: unknown): ValidationResult{
    if (typeof category !== 'string') {
        return { valid: false, error: 'Category must be text' };
    }
    const validCategories = ['Electronics', 'Accessories', 'Clothing', 'Books'];
    if(!validCategories.includes(category as string)){
        return{
            valid: false,
            error: `Category must be one of: ${validCategories.join(', ')}`
        }
    }
    return { valid: true };
}
export function validateDescription(description: unknown): ValidationResult{
    if(typeof description !== 'string'){
        return { valid: false, error: 'Description must be a string' };
    }
    const trimmed = description.trim();
    if(trimmed.length < 5){
        return { valid: false, error: 'Description must be at least 5 characters long' };
    }
    return { valid: true };
}

export function validateCreateProduct(data: unknown): ValidationResult {
    // 1. The Bouncer Check: Reject null or non-objects immediately
    if (typeof data !== 'object' || data === null) {
        return { valid: false, error: 'Data must be a valid JSON object' };
    }

    // 2. The Safe Cast: Tell TypeScript it is safe to check the keys
    const payload = data as Record<string, unknown>;

    // 3. The Field Checks: Pass the safe payload to your individual validators
    const nameValidation = validateName(payload.name);
    if (!nameValidation.valid) return nameValidation;

    const priceValidation = validatePrice(payload.price);
    if (!priceValidation.valid) return priceValidation;

    const stockValidation = validateStock(payload.stock);
    if (!stockValidation.valid) return stockValidation;

    const categoryValidation = validateCategory(payload.category);
    if (!categoryValidation.valid) return categoryValidation;

    const descriptionValidation = validateDescription(payload.description);
    if (!descriptionValidation.valid) return descriptionValidation;

    // 4. The VIP Pass: If it survives all checks, it is 100% clean data
    return { valid: true };
}
// ============ CRUD OPERATIONS ============

// GET ALL PRODUCTS
export async function getAllProducts(): Promise<IProduct[]> {
    try {
        return await Product.find({}).exec();
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        throw error;
    }
}

// GET ONE PRODUCT BY ID
export async function getProductById(id: number): Promise<IProduct | null> {
    try {
        return await Product.findOne({ id }).exec();
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        throw error;
    }
}

// CREATE NEW PRODUCT
export async function createProduct(
    data: unknown // 🛡️ Changed from CreateProductInput to validate boundary
): Promise<{ success: boolean; data?: IProduct; error?: string }> {
    try {
        // 1. Validate the unknown input first
        const validation = validateCreateProduct(data);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // 2. Now that we know it's safe, tell TypeScript what it is
        const safeData = data as CreateProductInput;

        // 3. Get the last product ID
        const lastProduct = await Product.findOne({}).sort({ id: -1 }).exec();
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        // 4. Create new product
        const newProduct = new Product({
            id: nextId,
            name: safeData.name.trim(),
            price: safeData.price,
            stock: safeData.stock,
            category: safeData.category,
            description: safeData.description.trim()
             
        });

        const saved = await newProduct.save();
        return { success: true, data: saved };

    } catch (error) {
        console.error('❌ Error creating product:', error);
        return { success: false, error: `Database error: ${error}` };
    }
}

// UPDATE PRODUCT
export async function updateProduct(
    id: number,
    updates: unknown // 🛡️ Changed to unknown for security
): Promise<{ success: boolean; data?: IProduct; error?: string }> {
    try {
        // 1. The Bouncer Check
        if (typeof updates !== 'object' || updates === null) {
            return { success: false, error: 'Updates must be a valid JSON object' };
        }

        const payload = updates as Record<string, unknown>;

        const product = await getProductById(id);
        if (!product) {
            return { success: false, error: `Product with ID ${id} not found` };
        }

        // 2. Check if at least one field is provided (fixed stock === undefined bug)
        if (!payload.name && payload.price === undefined && payload.stock === undefined && 
            !payload.category && !payload.description) {
            return { success: false, error: 'Please provide at least one field to update' };
        }

        // 3. Build update object strictly without `any`
        const updateDoc: Partial<CreateProductInput> & { available?: boolean } = {};

        if (payload.name !== undefined) {
            const validation = validateName(payload.name);
            if (!validation.valid) return { success: false, error: validation.error };
            updateDoc.name = (payload.name as string).trim();
        }

        if (payload.price !== undefined) {
            const validation = validatePrice(payload.price);
            if (!validation.valid) return { success: false, error: validation.error };
            updateDoc.price = payload.price as number;
        }

        if (payload.stock !== undefined) {
            const validation = validateStock(payload.stock);
            if (!validation.valid) return { success: false, error: validation.error };
            updateDoc.stock = payload.stock as number;
            
            // Recalculate available based on new stock
            updateDoc.available = updateDoc.stock > 0;
        }

        if (payload.category !== undefined) {
            const validation = validateCategory(payload.category);
            if (!validation.valid) return { success: false, error: validation.error };
            updateDoc.category = payload.category as string;
        }

        if (payload.description !== undefined) {
            const validation = validateDescription(payload.description);
            if (!validation.valid) return { success: false, error: validation.error };
            updateDoc.description = (payload.description as string).trim();
        }

        // 4. Update product
        const updated = await Product.findOneAndUpdate(
            { id },
            updateDoc,
            { new: true }
        ).exec();

        return { success: true, data: updated || undefined };

    } catch (error) {
        console.error('❌ Error updating product:', error);
        return { success: false, error: `Database error: ${error}` };
    }
}

// DELETE PRODUCT
export async function deleteProduct(id: number): Promise<{ success: boolean; data?: IProduct; error?: string }> {
    try {
        const product = await getProductById(id);
        if (!product) {
            return { success: false, error: `Product with ID ${id} not found` };
        }

        await Product.deleteOne({ id });
        return { success: true, data: product };

    } catch (error) {
        console.error('❌ Error deleting product:', error);
        return { success: false, error: `Database error: ${error}` };
    }
}

// ============ SEED INITIAL DATA ============
export async function seedInitialData(): Promise<void> {
    try {
        const count = await Product.countDocuments();
        
        if (count === 0) {
            console.log('📝 No products found, inserting initial data...');
            
            // We only need the required fields here! Mongoose handles dates and availability.
            const initialProducts = [
                { id: 1, name: "Gaming Laptop", price: 1299.99, stock: 15, category: "Electronics", description: "High-performance gaming laptop with RTX 4090" },
                { id: 2, name: "Wireless Mouse", price: 49.99, stock: 100, category: "Accessories", description: "Compact wireless mouse with 2.4GHz connection" },
                { id: 3, name: "USB-C Cable", price: 15.99, stock: 200, category: "Accessories", description: "Durable USB-C charging and data transfer cable" },
                { id: 4, name: "Mechanical Keyboard", price: 129.99, stock: 0, category: "Accessories", description: "RGB mechanical keyboard with Cherry MX switches" }
            ];

            await Product.insertMany(initialProducts);
            console.log(`✅ Inserted ${initialProducts.length} products`);
        } else {
            console.log(`✅ Found ${count} products in database`);
        }
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}
// ============ ADVANCED QUERY FUNCTIONS ============
export async function searchProductsByName(searchTerm: string): Promise<IProduct[]> {
    try{
        if(!searchTerm || searchTerm.trim() === ''){
            return [];
        }
        const products = await Product.find({name: { $regex: searchTerm, $options: 'i' }}).exec();
        return products;
    }catch(error){
        console.error('❌ Error searching products:', error);
        throw error;
    }
}
export async function filterProductsByCategory(category: string): Promise<IProduct[]> {
    try{
        const validCategories = ['Electronics', 'Accessories', 'Clothing', 'Books'];
        if(!validCategories.includes(category)){
            throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
        }

        const products = await Product.find({ category }).exec();
        return products;
    }catch(error){
        console.error('❌ Error filtering products:', error);
        throw error;
    }
}

export async function sortProductsByPrice(
    sortOrder: 'asc' | 'desc' = 'asc'
): Promise<IProduct[]> {
    try {
        // Mongoose natively understands 'asc' and 'desc', so we just pass it straight in!
        const products = await Product.find({})
            .sort({ price: sortOrder })
            .exec();
            
        return products;
    } catch (error) {
        console.error('❌ Error sorting products:', error);
        throw error;
    }
}
export async function getPaginatedProducts(
    page: number = 1,
    limit: number = 10
): Promise<{
    products: IProduct[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
}> {
    try {
        if(page < 1) page = 1;
        if(limit < 1) limit = 10;
        const skip = (page - 1) * limit;
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find({})
            .skip(skip)
            .limit(limit)
            .sort({ id: 1 }) // Optional: sort by ID ascending for consistent pagination
            .exec();
        return {
            products,
            currentPage: page,
            totalPages,
            totalProducts
        };
    }catch (error) {
        console.error('❌ Error fetching paginated products:', error);
        throw error;
    }

    
}
// advanced search
// User wants:
// "Show me cheap Gaming products in Electronics category, page 2"

// This needs:
// ├─ Search: "Gaming" in name
// ├─ Filter: "Electronics" category  
// ├─ Sort: Ascending (cheap to expensive)
// └─ Pagination: Page 2

// We need ONE function that does all of this!

export async function searchProductsAdvanced(
    query:{
        search?: string;           // Optional
        category?: string;         // Optional
        sortBy?: 'asc' | 'desc';  // Optional
        page?: number;             // Optional
        limit?: number; 
    } 
    ): Promise<{
        products: IProduct[];
        currentPage: number;
        totalPages: number;
        totalProducts: number;
        query: any; // Echo back the query for debugging
    }> {
    try {
        const filter: any = {};
        if (query.search && query.search.trim() !== '') {
            filter.name = { $regex: query.search, $options: 'i' };
        }
        if (query.category && query.category.trim() !== '') {
            filter.category = query.category;
        }
        const page  = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? query.limit : 10;
        const sortOrder = query.sortBy === 'desc' ? -1 : 1;
        
        const skip = (page - 1) * limit;
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(filter)
            .sort({ price: sortOrder })
            .skip(skip)
            .limit(limit)
            .exec();
        
        return {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            query :{
                search: query.search || 'none',
                category: query.category || 'all',
                sortOrder: query.sortBy || 'asc',
                page,
                limit
            }
        };
    } catch (error) {
        console.error('❌ Error in advanced search:', error);
        throw error;
    }
}