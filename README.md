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
│   ├── models/
│   │   └── Product.ts      # Mongoose schema with validation
│   ├── server.ts           # Express server with MongoDB Atlas
│   ├── mongoDb.ts          # Mongoose connection setup
│   ├── mongoProducts.ts    # CRUD functions with Mongoose
│   ├── products.ts         # Legacy (in-memory, archived)
│   ├── test-validators.ts  # Validator testing
│   └── products.test.ts    # Unit tests (coming)
├── dist/                   # Compiled JavaScript
├── node_modules/           # Dependencies
├── .env                    # MongoDB Atlas connection (git ignored)
├── .env.example            # Example env file
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

### Step 1: Project Setup (DONE) ✅

- Initialized TypeScript and Express
- Created folder structure
- Configured npm scripts
- Created .gitignore and package.json

### Step 2: Types and Interfaces (DONE) ✅

- Created Product interface with 8 fields
- Added 4 sample products
- Built getAllProducts() function
- Tested endpoint at /products

### Step 3: Validation Functions (DONE) ✅

- Built validators for price, stock, name, category, description
- Created master validateCreateProduct() function
- Tested all validators with test-validators.ts
- Learned guard clauses and error handling

### Step 4: CRUD Operations (DONE) ✅

- ✅ Get all products
- ✅ Get single product by ID
- ✅ Create new products
- ✅ Update existing products
- ✅ Delete products
- ✅ Complete error handling

### Step 5: Testing (DONE) ✅

- ✅ Jest framework setup
- ✅ Validator tests passing
- ✅ CRUD operation tests
- ✅ API endpoint testing with curl

### Step 6: Database Integration (DONE) ✅

- ✅ **MongoDB Atlas Cloud Setup**
  - Created free tier account
  - Configured cloud cluster
  - Network access whitelist
  - Admin credentials created

- ✅ **Mongoose ORM Integration**
  - Installed mongoose and dotenv
  - Created Product schema with full validation
  - Connection file (mongoDb.ts) with auto-connect
  - Environment variables for secure credentials

- ✅ **CRUD with MongoDB**
  - getAllProducts() - retrieves from cloud
  - getProductById(id) - cloud queries
  - createProduct() - saves to MongoDB Atlas
  - updateProduct() - modifies cloud documents
  - deleteProduct() - removes from cloud
  - seedInitialData() - auto-populates on first run

- ✅ **API Routes Updated**
  - All endpoints now use cloud MongoDB
  - Full error handling
  - Graceful shutdown
  - Connection pooling with Mongoose

- ✅ **Production Ready**
  - Data persists in MongoDB Atlas
  - Type-safe with TypeScript
  - Automatic schema validation
  - Secure connection with credentials in .env

## API Endpoints

### Current Status: ALL COMPLETE ✅

| Method | Endpoint      | Purpose               | Status | Database |
| ------ | ------------- | --------------------- | ------ | -------- |
| GET    | /             | Welcome message       | ✅ DONE   | MongoDB Atlas |
| GET    | /products     | Get all products      | ✅ DONE   | MongoDB Atlas |
| GET    | /products/:id | Get one product by ID | ✅ DONE   | MongoDB Atlas |
| POST   | /products     | Create new product    | ✅ DONE   | MongoDB Atlas |
| PUT    | /products/:id | Update product        | ✅ DONE   | MongoDB Atlas |
| DELETE | /products/:id | Delete product        | ✅ DONE   | MongoDB Atlas |

## Sample API Response

### GET /products

Returns array of all products from MongoDB Atlas:

```json
[
  {
    "_id": "66abcd1234xyz",
    "id": 1,
    "name": "Gaming Laptop",
    "price": 1299.99,
    "stock": 15,
    "category": "Electronics",
    "description": "High-performance gaming laptop with RTX 4090",
    "available": true,
    "createdAt": "2026-05-27T16:30:00.000Z"
  },
  {
    "_id": "66abcd5678xyz",
    "id": 2,
    "name": "Wireless Mouse",
    "price": 49.99,
    "stock": 100,
    "category": "Accessories",
    "description": "Compact wireless mouse with 2.4GHz connection",
    "available": true,
    "createdAt": "2026-05-27T16:30:00.000Z"
  }
]
```

### POST /products (Create)

Request body:
```json
{
  "name": "iPad Pro",
  "price": 1099.99,
  "stock": 25,
  "category": "Electronics",
  "description": "Apple tablet with M2 processor and Retina display"
}
```

Response:
```json
{
  "_id": "66abcd9999xyz",
  "id": 5,
  "name": "iPad Pro",
  "price": 1099.99,
  "stock": 25,
  "category": "Electronics",
  "description": "Apple tablet with M2 processor and Retina display",
  "available": true,
  "createdAt": "2026-05-27T16:35:00.000Z"
}
```

### PUT /products/:id (Update)

Request to update product ID 1:
```bash
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 999.99}'
```

Response:
```json
{
  "_id": "66abcd1234xyz",
  "id": 1,
  "name": "Gaming Laptop",
  "price": 999.99,
  "stock": 15,
  "category": "Electronics",
  "description": "High-performance gaming laptop with RTX 4090",
  "available": true,
  "createdAt": "2026-05-27T16:30:00.000Z"
}
```

## Data Models

### MongoDB Schema & Mongoose Model

**File: src/models/Product.ts**

```typescript
interface IProduct extends Document {
  _id?: ObjectId;      // MongoDB generated ID
  id: number;          // Unique identifier (1, 2, 3...)
  name: string;        // Product name (2-100 characters)
  price: number;       // Price in dollars (0-100,000)
  stock: number;       // Quantity available (whole number, >= 0)
  category: string;    // One of: Electronics, Accessories, Clothing, Books
  description: string; // Product details (5+ characters)
  available: boolean;  // Can be purchased (true if stock > 0)
  createdAt: Date;     // When product was added to database
}
```

**Mongoose Schema Details:**
- All fields required except `_id`
- String fields auto-trimmed (remove spaces)
- Numeric validation built-in
- Enum validation for categories
- Unique constraint on `id` field
- Auto-generated `_id` by MongoDB
- `createdAt` defaults to current timestamp

## Database: MongoDB Atlas with Mongoose

### Why MongoDB Atlas?

```
Traditional Database Setup:     MongoDB Atlas (Cloud):
├─ Install locally             ├─ Zero installation
├─ Manage backups              ├─ Automatic backups
├─ Handle updates              ├─ Zero maintenance
├─ Fix issues yourself         ├─ Professional support
└─ Limited to one computer     └─ Access from anywhere
```

### Architecture Overview

**Connection Flow:**
```
Node.js Application
├─ server.ts (Express routes)
├─ mongoDb.ts (Mongoose connection)
├─ mongoProducts.ts (CRUD functions)
└─ models/Product.ts (Data schema)
    │
    └─ Mongoose ORM
        │
        └─ MongoDB Atlas Cloud Database
            ├─ shop-api database
            └─ products collection (table)
```

### Setup Complete

**1. Environment Variables (.env)**
```
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/shop-api?retryWrites=true&w=majority
```

**2. Connection File (mongoDb.ts)**
- Automatically connects on server startup
- Connection pooling handled by Mongoose
- Graceful shutdown implemented
- Error handling for network issues

**3. CRUD Operations (mongoProducts.ts)**
```
getAllProducts()      → Query all documents
getProductById(id)    → Find by custom id field
createProduct(data)   → Insert new document
updateProduct(id)     → Modify existing document
deleteProduct(id)     → Remove document
seedInitialData()     → Auto-populate first run
```

**4. Data Validation**
- Schema-level validation in Mongoose
- Business logic validation in functions
- Type-safe with TypeScript
- Automatic error messages

### Testing Endpoints

**Start Server (VS Code Terminal):**
```bash
npm run dev
```

**Test Endpoints (Mac Terminal):**
```bash
# Get all
curl http://localhost:3000/products

# Get one
curl http://localhost:3000/products/1

# Create
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"iPad","price":799.99,"stock":20,"category":"Electronics","description":"Apple tablet computer"}'

# Update
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":999.99}'

# Delete
curl -X DELETE http://localhost:3000/products/1
```

### Verify in MongoDB Atlas Dashboard

1. Go to https://www.mongodb.com/cloud/atlas
2. Click your cluster
3. Click "Collections" tab
4. Expand: `shop-api` → `products`
5. View all your data in the cloud! ☁️

## Testing Validators

### Run Validator Tests

```bash
npx ts-node src/test-validators.ts
```

## Key Concepts Learned

### Phase 1: Foundations (Steps 1-3) ✅

- TypeScript Interfaces - Creating blueprints for data
- Type Safety - Catching errors before runtime
- Data Modeling - Planning your data structure
- Validation - Ensuring data integrity
- Guard Clauses - Checking conditions early
- Error Handling - Providing helpful error messages

### Phase 2: REST API (Step 4) ✅

- GET Operations - Reading data
- POST Operations - Creating data
- PUT Operations - Updating data
- DELETE Operations - Removing data
- HTTP Status Codes - 200, 201, 400, 404, 500
- Separation of Concerns - Logic separate from routes

### Phase 3: Testing (Step 5) ✅

- Unit Tests - Test individual functions
- Integration Tests - Test endpoints together
- Jest Framework - Testing library
- Test Coverage - Measuring what's tested
- Test-Driven Development - Write tests first
- curl Commands - Manual API testing

### Phase 4: Database (Step 6) ✅

- CRUD Operations - Create, Read, Update, Delete from cloud
- MongoDB Atlas - Cloud database service (free tier)
- Mongoose ORM - Simplified database interactions
- Schema Validation - Data structure enforcement
- Connection Pooling - Efficient database connections
- Environment Variables - Secure credential management
- Data Persistence - Data stored permanently in cloud
- TypeScript Models - Type-safe database operations

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (watches for changes, connects to MongoDB Atlas)
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

# View your git commits
git log --oneline
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
- [x] Step 4: CRUD Operations (In-Memory)
- [x] Step 5: Unit Testing & curl Testing
- [x] Step 6: Database Integration (MongoDB Atlas + Mongoose)

**COMPLETED FEATURES:**
- [x] All 6 API endpoints working
- [x] Full CRUD operations
- [x] Data stored in MongoDB Atlas cloud
- [x] Mongoose schema with validation
- [x] Environment variables for security
- [x] Automatic data seeding
- [x] Error handling
- [x] TypeScript type safety

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

## Next Steps (Phase 2: Advanced Features)

Now that you have a complete MongoDB Atlas setup, you can build:

### Phase 2: Advanced Queries

- Search products by name
- Filter by category
- Sort by price (ascending/descending)
- Pagination (limit, skip)
- Price range filtering

### Phase 3: Relationships & Complex Data

- User profiles (who's buying)
- Order management (what's being bought)
- Order items (quantity, pricing at purchase time)
- Reviews and ratings
- Inventory tracking

### Phase 4: Authentication & Security

- User login/signup
- JWT (JSON Web Tokens)
- Password hashing with bcrypt
- Protected routes
- Role-based access control

### Phase 5: Error Handling & Logging

- Global error middleware
- Error tracking
- Request logging (Winston, Morgan)
- Performance monitoring
- Debug mode for development

### Phase 6: DevOps & Production Deployment

- Docker containerization
- Environment configuration
- CI/CD pipeline (GitHub Actions)
- Cloud deployment (AWS, Heroku)
- Database backups
- Performance optimization

## License

MIT License - Open source, free to use
