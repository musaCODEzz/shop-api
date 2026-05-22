// This file tests all validators

import { 
    validatePrice, 
    validateStock, 
    validateName, 
    validateCategory,
    validateDescription 
} from './products';
import { validateCreateProduct } from './products';

console.log("=== TESTING VALIDATORS ===\n");

// Test 1: validatePrice
console.log("Test 1: validatePrice");
console.log("  ✅ Valid price:", validatePrice(99.99));
console.log("  ❌ Negative price:", validatePrice(-50));
console.log("  ❌ Too high:", validatePrice(200000));
console.log();

// Test 2: validateStock
console.log("Test 2: validateStock");
console.log("  ✅ Valid stock:", validateStock(50));
console.log("  ❌ Negative stock:", validateStock(-10));
console.log("  ❌ Decimal stock:", validateStock(5.5));
console.log();

// Test 3: validateName
console.log("Test 3: validateName");
console.log("  ✅ Valid name:", validateName("Gaming Laptop"));
console.log("  ❌ Empty name:", validateName(""));
console.log("  ❌ Too short:", validateName("X"));
console.log();

// Test 4: validateCategory
console.log("Test 4: validateCategory");
console.log("  ✅ Valid category:", validateCategory("Electronics"));
console.log("  ❌ Invalid category:", validateCategory("Food"));
console.log();

// Test 5: validateDescription
console.log("Test 5: validateDescription");
console.log("  ✅ Valid description:", validateDescription("This is a great laptop"));
console.log("  ❌ Too short:", validateDescription("Nice"));
console.log();


// ... previous tests ...

console.log("\nTest 6: validateCreateProduct (entire product)");

// Valid product
const validProduct = {
    name: "New Laptop",
    price: 1299.99,
    stock: 10,
    category: "Electronics",
    description: "Brand new gaming laptop"
};
console.log("  ✅ Valid product:", validateCreateProduct(validProduct));

// Invalid product - missing name
const invalidProduct1 = {
    name: "",
    price: 1299.99,
    stock: 10,
    category: "Electronics",
    description: "Brand new gaming laptop"
};
console.log("  ❌ Missing name:", validateCreateProduct(invalidProduct1));

// Invalid product - bad price
const invalidProduct2 = {
    name: "New Laptop",
    price: -100,
    stock: 10,
    category: "Electronics",
    description: "Brand new gaming laptop"
};
console.log("  ❌ Negative price:", validateCreateProduct(invalidProduct2));
console.log("=== TESTS COMPLETE ===");