export interface Product{
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
    available: boolean;
    createdAt: Date;
}

let products: Product[] = [
    {
        id: 1,
        name: "Laptop",
        price: 999.99,
        stock: 10,
        category: "Electronics",
        description: "A high-performance laptop for work and play.",
        available: true,
        createdAt: new Date("2023-01-01")
    },
    {
        id: 2,
        name: "Smartphone",
        price: 499.99,
        stock: 20,
        category: "Electronics",
        description: "A sleek smartphone with the latest features.",
        available: true,
        createdAt: new Date("2023-02-15")
    },
    {
        id: 3,
        name: "Headphones",
        price: 199.99,
        stock: 15,
        category: "Accessories",
        description: "Noise-cancelling headphones for immersive sound.",
        available: true,
        createdAt: new Date("2023-03-10")
    },
    {
        id: 4,
        name: "Coffee Maker",
        price: 79.99,
        stock: 0,
        category: "Electronics",
        description: "Brew the perfect cup of coffee every morning.",
        available: false,
        createdAt: new Date("2023-04-05")
    }
];
let nextProductId = products.length + 1;

// findd all products that are available
export function getAllProducts(): Product[] {
    return products;
}
// find product by id
export function getProductById(id: number): Product | undefined {
    return products.find(p => p.id === id);
}

//create a new product
export function createProduct(data: CreateProductInput): { success: boolean; data?: Product; error?: string } {
    const validation = validateCreateProduct(data);
    if(!validation.valid){
        return { success: false, error: validation.error };
    }
    const newProduct: Product = {
        id: nextProductId++,
        name: data.name.trim(),
        price: data.price,
        stock: data.stock,
        category: data.category,
        description: data.description.trim(),
        available: data.stock > 0,
        createdAt: new Date()
    };
    products.push(newProduct);
    return { success: true, data: newProduct };
}

// ============ UPDATE PRODUCT ============

// Update an existing product
export function updateProduct(
    id: number,
    updates: Partial<CreateProductInput>
): { success: boolean; data?: Product; error?: string } {
    // Step 1: Find the product
    const product = getProductById(id);
    
    // If product doesn't exist, return error
    if (!product) {
        return { success: false, error: `Product with ID ${id} not found` };
    }

    // Step 2: Check if at least one field is provided
    if (!updates.name && updates.price === undefined && !updates.stock && !updates.category && !updates.description) {
        return { success: false, error: "Please provide at least one field to update" };
    }

    // Step 3: Validate each field that was provided
    if (updates.name !== undefined) {
        const nameValidation = validateName(updates.name);
        if (!nameValidation.valid) {
            return { success: false, error: nameValidation.error };
        }
    }

    if (updates.price !== undefined) {
        const priceValidation = validatePrice(updates.price);
        if (!priceValidation.valid) {
            return { success: false, error: priceValidation.error };
        }
    }

    if (updates.stock !== undefined) {
        const stockValidation = validateStock(updates.stock);
        if (!stockValidation.valid) {
            return { success: false, error: stockValidation.error };
        }
    }

    if (updates.category !== undefined) {
        const categoryValidation = validateCategory(updates.category);
        if (!categoryValidation.valid) {
            return { success: false, error: categoryValidation.error };
        }
    }

    if (updates.description !== undefined) {
        const descriptionValidation = validateDescription(updates.description);
        if (!descriptionValidation.valid) {
            return { success: false, error: descriptionValidation.error };
        }
    }

    // Step 4: Apply updates to the product
    if (updates.name !== undefined) {
        product.name = updates.name.trim();
    }

    if (updates.price !== undefined) {
        product.price = updates.price;
    }

    if (updates.stock !== undefined) {
        product.stock = updates.stock;
    }

    if (updates.category !== undefined) {
        product.category = updates.category;
    }

    if (updates.description !== undefined) {
        product.description = updates.description.trim();
    }

    // Step 5: Update 'available' based on stock
    product.available = product.stock > 0;

    // Step 6: Return success with updated product
    return { success: true, data: product };
}
// ============ DELETE PRODUCT ============

// Delete a product
export function deleteProduct(id: number): { success: boolean; data?: Product; error?: string } {
    // Step 1: Find the product's position in the array
    const index = products.findIndex(p => p.id === id);
    
    // If not found, return error
    if (index === -1) {
        return { success: false, error: `Product with ID ${id} not found` };
    }

    // Step 2: Remove the product from array
    // splice() removes items from array and returns them
    // splice(index, 1) means: starting at index, remove 1 item
    // [0] means: get the first (and only) item removed
    const deletedProduct = products.splice(index, 1)[0];

    // Step 3: Return success with the deleted product
    return { success: true, data: deletedProduct };
}






export function validatePrice(price:number):{ valid: boolean; error?: string } {
    if(price === undefined || price === null){
        return { valid: false, error: "Price is required." };
    }
    if(typeof price !== 'number' || isNaN(price)){
        return { valid: false, error: "Price must be a valid number." };
    }
    if(price < 0){
        return { valid: false, error: "Price cannot be negative." };
    }
    if(price > 100000){
        return { valid: false, error: "Price cannot exceed $100,000." };
    }
    return { valid: true };
}

export function validateStock(stock:number):{ valid: boolean; error?: string } {
    if(stock === undefined || stock === null){
        return { valid: false, error: "Stock is required." };
    }
    if(typeof stock !== 'number' || isNaN(stock)){
        return { valid: false, error: "Stock must be a valid number." };
    }
    if(stock < 0){
        return { valid: false, error: "Stock cannot be negative." };
    }
    // Ensure stock is an integer
    if(!Number.isInteger(stock)){
        return { valid: false, error: "Stock must be an integer." };
    }
    return { valid: true };
}
export function validateName(name:string):{ valid: boolean; error?: string } {

    if(name === undefined || name === null || name.trim() === ""){
        return { valid: false, error: "Name is required." };
    }
    if(name.trim().length < 2){
        return { valid: false, error: "Name must be at least 2 characters long." };
    }
    if(name.trim().length > 100){
        return { valid: false, error: "Name cannot exceed 100 characters." };
    }
    if(typeof name !== 'string'){
        return { valid: false, error: "Name must be a string." };
    }
    return { valid: true };
}

export function validateCategory(category:string):{ valid: boolean; error?: string } {
    const validCategories = ["Electronics", "Accessories", "Clothing", "Books"];
    if(category === undefined || category === null || category.trim() === ""){
        return { valid: false, error: "Category is required." };
    }
    // is category one of the valid categories?
    if(!validCategories.includes(category)){
        return { valid: false, error: `Category must be one of the following: ${validCategories.join(", ")}.` };
    }
    return { valid: true };
}

export function validateDescription(description:string):{ valid: boolean; error?: string } {
    if(description === undefined || description === null || description.trim() === ""){
        return { valid: false, error: "Description is required." };
    }
    if(description.trim().length < 5){
        return { valid: false, error: "Description must be at least 5 characters long." };
    }
    return { valid: true };
}

export interface CreateProductInput {
    name: string;
    price: number;
    stock: number;
    category: string;
    description: string;
}

export function validateCreateProduct(
    data: any
):{ valid: boolean; error?: string } {
    // check if it exists
    if(!data.name){
        return { valid: false, error: "Name is required." };
    }
    // validate each field
    const nameValidation = validateName(data.name);
    if(!nameValidation.valid){
        return nameValidation;
    }
    if(!data.price === undefined ){
        return { valid: false, error: "Price is required." };
    }
    const priceValidation = validatePrice(data.price);
    if(!priceValidation.valid){
        return priceValidation;
    }
    if(!data.stock === undefined){
        return { valid: false, error: "Stock is required." };
    }
    const stockValidation = validateStock(data.stock);
    if(!stockValidation.valid){
        return stockValidation;
    }
    if(!data.category === undefined){
        return { valid: false, error: "Category is required." };
    }
    const categoryValidation = validateCategory(data.category);
    if(!categoryValidation.valid){
        return categoryValidation;
    }
    if(!data.description === undefined){
        return { valid: false, error: "Description is required." };
    }
    const descriptionValidation = validateDescription(data.description);
    if(!descriptionValidation.valid){
        return descriptionValidation;
    }
    return { valid: true };
}