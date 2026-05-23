# Shop API - E-commerce Product Catalog

A professional backend API for managing an e-commerce product catalog, built with TypeScript, Express.js, and Node.js.

## Project Overview

This is a learning project demonstrating professional backend development practices:

- Separation of concerns (business logic vs routes)
- Type-safe code with TypeScript
- Comprehensive validation
- RESTful API design
- Automated testing

Domain: E-commerce - managing products, inventory, and categories.

## Learning Objectives

Through building this project, you will learn:

- TypeScript interfaces and types
- Express.js routing and middleware
- Data validation and error handling
- REST API best practices
- Testing with Jest
- Git version control
- Professional code organization

## Project Structure

```
shop-api/
├── src/
│   ├── server.ts           # Express server setup
│   ├── products.ts         # Business logic (types, data, functions)
│   ├── test-validators.ts  # Validator testing
│   └── products.test.ts    # Unit tests (coming in Step 4)
├── dist/                   # Compiled JavaScript
├── node_modules/           # Dependencies
├── package.json            # Project metadata
├── tsconfig.json           # TypeScript config
├── jest.config.cjs         # Jest testing config
├── .gitignore              # Files to exclude from git
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Go to project directory
cd shop-api

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Verify Setup

Visit: http://localhost:3000/products

You should see 4 sample products in JSON format.

## Step-by-Step Learning Path

### Step 1: Project Setup (DONE)

- Initialized TypeScript and Express
- Created folder structure
- Configured npm scripts
- Created .gitignore and package.json

### Step 2: Types and Interfaces (DONE)

- Created Product interface with 8 fields
- Added 4 sample products
- Built getAllProducts() function
- Tested endpoint at /products

### Step 3: Validation Functions (DONE)

- Built validators for price, stock, name, category, description
- Created master validateCreateProduct() function
- Tested all validators with test-validators.ts
- Learned guard clauses and error handling

### Step 4: CRUD Operations (NEXT)

- Get single product by ID
- Create new products
- Update existing products
- Delete products

### Step 5: Testing (COMING SOON)

- Write Jest unit tests
- Test all operations
- Achieve 100% code coverage

### Step 6: Database Integration (FUTURE)

- Connect to MongoDB or PostgreSQL
- Replace in-memory array with real database
- Learn ORM/query builders

## API Endpoints

### Current Status

| Method | Endpoint      | Purpose               | Status |
| ------ | ------------- | --------------------- | ------ |
| GET    | /             | Welcome message       | DONE   |
| GET    | /products     | Get all products      | DONE   |
| GET    | /products/:id | Get one product by ID | Step 4 |
| POST   | /products     | Create new product    | Step 4 |
| PUT    | /products/:id | Update product        | Step 4 |
| DELETE | /products/:id | Delete product        | Step 4 |

## Sample API Response

### GET /products

Returns array of all products:

```json
[
  {
    "id": 1,
    "name": "Gaming Laptop",
    "price": 1299.99,
    "stock": 15,
    "category": "Electronics",
    "description": "High-performance gaming laptop with RTX 4080",
    "available": true,
    "createdAt": "2026-05-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Wireless Mouse",
    "price": 49.99,
    "stock": 100,
    "category": "Electronics",
    "description": "Ergonomic wireless mouse with 2.4GHz connection",
    "available": true,
    "createdAt": "2026-05-02T00:00:00.000Z"
  }
]
```

## Data Models

### Product Interface

```typescript
interface Product {
  id: number; // Unique identifier
  name: string; // Product name (2-100 characters)
  price: number; // Price in dollars (0-100,000)
  stock: number; // Quantity available (whole number)
  category: string; // Electronics, Accessories, Clothing, Books
  description: string; // Product details (5+ characters)
  available: boolean; // Can be purchased (true/false)
  createdAt: Date; // When product was added
}
```

### CreateProductInput Interface

```typescript
interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}
```

## Validation Rules

All validators return: { valid: boolean; error?: string }

### Price Validation (validatePrice)

- Must be a number
- Must be positive (>= 0)
- Cannot exceed 100,000
- Rejects: -50, 200000, "99"
- Accepts: 99.99, 0, 50000

### Stock Validation (validateStock)

- Must be a number
- Must be non-negative (>= 0)
- Must be whole number (integer)
- Rejects: -10, 5.5, "50"
- Accepts: 0, 50, 100

### Name Validation (validateName)

- Must be a string
- Must be non-empty (after trimming spaces)
- Must be 2-100 characters
- Rejects: "", "X", "A" (too short), very long strings
- Accepts: "Laptop", "USB-C Cable", "Gaming Keyboard"

### Category Validation (validateCategory)

- Must be one of: Electronics, Accessories, Clothing, Books
- Rejects: Food, Toys, Furniture
- Accepts: Electronics, Accessories, Clothing, Books

### Description Validation (validateDescription)

- Must be a string
- Must be non-empty
- Must be at least 5 characters
- Rejects: "", "Nice", "Good"
- Accepts: "High-performance laptop", "Wireless gaming mouse"

### Master Validation (validateCreateProduct)

- Validates all fields at once
- Stops at first error and returns it
- Used before creating new products

## Testing Validators

### Run Validator Tests

```bash
npx ts-node src/test-validators.ts
```

## Key Concepts Learned

### Phase 1: Foundations (Steps 1-3)

- TypeScript Interfaces - Creating blueprints for data
- Type Safety - Catching errors before runtime
- Data Modeling - Planning your data structure
- Validation - Ensuring data integrity
- Guard Clauses - Checking conditions early
- Error Handling - Providing helpful error messages

### Phase 2: REST API (Step 4)

- GET Operations - Reading data
- POST Operations - Creating data
- PUT Operations - Updating data
- DELETE Operations - Removing data
- HTTP Status Codes - 200, 201, 400, 404, 500
- Separation of Concerns - Logic separate from routes

### Phase 3: Testing (Step 5)

- Unit Tests - Test individual functions
- Integration Tests - Test endpoints together
- Jest Framework - Testing library
- Test Coverage - Measuring what's tested
- Test-Driven Development - Write tests first

### Phase 4: Database (Step 6)

- CRUD Operations - Create, Read, Update, Delete
- Database Design - Schema planning
- ORM/Query Building - Interact with databases
- Data Persistence - Storing data permanently

## Development Commands

```bash
# Start development server (watches for changes)
npm run dev

# Compile TypeScript to JavaScript
npm run build

# Run compiled code
npm start

# Run all tests
npm test

# Run specific test file
npm test -- products.test.ts

# Check TypeScript errors
npx tsc --noEmit
```

## Common Errors and Solutions

### Error: "Cannot find module './products'"

- Cause: Filename mismatch or wrong path
- Solution: Verify filename is exactly products.ts

### Error: "Port 3000 already in use"

- Cause: Server already running
- Solution: Press Ctrl + C to stop, then restart with npm run dev

### Error: "TypeError: Cannot read property 'name' of undefined"

- Cause: Accessing product that doesn't exist
- Solution: Always check if product exists before using it

### Error: "ValidationError: Price cannot be negative"

- Cause: Invalid data sent to API
- Solution: Check your request body matches validation rules

### Error: "Module not found: '@types/express'"

- Cause: Dependencies not installed
- Solution: Run npm install

## Checklist: Project Milestones

- [x] Step 1: Project Setup
- [x] Step 2: Product Types and Interfaces
- [x] Step 3: Validation Functions
- [ ] Step 4: CRUD Operations
- [ ] Step 5: Unit Testing
- [ ] Step 6: Database Integration

## Git Workflow

```bash
# See what changed
git status

# Stage all changes
git add .

# Create commit with message
git commit -m "Add feature description"

# View all commits
git log --oneline
```

## Next Steps (Step 4)

In Step 4, you will:

1. Add getProductById function
2. Add createProduct function
3. Add updateProduct function
4. Add deleteProduct function
5. Add routes to server.ts
6. Test all endpoints
7. Commit to git

## License

MIT License - Open source, free to use
