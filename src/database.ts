import Database, { type Database as SQLiteDatabase } from 'better-sqlite3';
import path from 'path';

// ============ CREATE DATABASE CONNECTION ============

// Get the database file path
// This creates "shop.db" in your project root
const dbPath = path.resolve(__dirname, '..', 'shop.db');

// Create connection to database
// If file doesn't exist, better-sqlite3 creates it automatically
const db: SQLiteDatabase = new Database(dbPath);

console.log(`📦 Database file: ${dbPath}`);

// ============ CREATE PRODUCTS TABLE ============

// SQL to create products table
const createTableSQL = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        available INTEGER NOT NULL,
        createdAt TEXT NOT NULL
    )
`;

// Run the SQL to create table
db.exec(createTableSQL);

console.log('✅ Products table ready!');

// ============ INSERT INITIAL DATA ============

// Check if products already exist
const checkProducts = db.prepare('SELECT COUNT(*) as count FROM products');
const result = checkProducts.get() as { count: number };

if (result.count === 0) {
    console.log('📝 Inserting initial products...');
    
    const insertProduct = db.prepare(`
        INSERT INTO products (name, price, stock, category, description, available, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    const initialProducts = [
        ['Gaming Laptop', 1299.99, 15, 'Electronics', 'High-performance gaming laptop with RTX 4090', 1, now],
        ['Wireless Mouse', 49.99, 100, 'Accessories', 'Compact wireless mouse with 2.4GHz connection', 1, now],
        ['USB-C Cable', 15.99, 200, 'Accessories', 'Durable USB-C charging and data transfer cable', 1, now],
        ['Mechanical Keyboard', 129.99, 0, 'Accessories', 'RGB mechanical keyboard with Cherry MX switches', 0, now]
    ];

    initialProducts.forEach(product => {
        insertProduct.run(...product);
    });

    console.log(`✅ Inserted ${initialProducts.length} products`);
}

// ============ EXPORT DATABASE CONNECTION ============

export default db;