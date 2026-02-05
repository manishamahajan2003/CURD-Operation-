const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

// CORS configuration for production
app.use(cors({
  origin: ['https://frontend-8k6glgc7n-manishamahajan2003s-projects.vercel.app', 
           'https://frontend-one-delta-44.vercel.app'],
  credentials: true
}));

app.use(bodyParser.json());

// API routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Utility endpoint to reset all IDs to start from 1
app.post('/api/reset-ids', (req, res) => {
  const db = require('./db');
  
  db.query('START TRANSACTION', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Reset category IDs
    db.query('SET @count = 0; UPDATE categories SET categoryId = (@count:=@count+1) ORDER BY categoryId', (err) => {
      if (err) {
        console.error(err);
        db.query('ROLLBACK');
        return res.status(500).json({ message: 'Database error' });
      }

      db.query('ALTER TABLE categories AUTO_INCREMENT = 1', (err) => {
        if (err) {
          console.error(err);
          db.query('ROLLBACK');
          return res.status(500).json({ message: 'Database error' });
        }

        // Reset product IDs
        db.query('SET @count = 0; UPDATE products SET productId = (@count:=@count+1) ORDER BY productId', (err) => {
          if (err) {
            console.error(err);
            db.query('ROLLBACK');
            return res.status(500).json({ message: 'Database error' });
          }

          db.query('ALTER TABLE products AUTO_INCREMENT = 1', (err) => {
            if (err) {
              console.error(err);
              db.query('ROLLBACK');
              return res.status(500).json({ message: 'Database error' });
            }

            db.query('COMMIT', (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
              }

              res.json({ message: 'All IDs reset successfully' });
            });
          });
        });
      });
    });
  });
});

// Initialize database tables with proper auto-increment
app.post('/api/init-db', (req, res) => {
  const db = require('./db');
  
  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      categoryId INT AUTO_INCREMENT PRIMARY KEY,
      categoryName VARCHAR(255) NOT NULL
    )
  `;
  
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      productId INT AUTO_INCREMENT PRIMARY KEY,
      productName VARCHAR(255) NOT NULL,
      categoryId INT,
      FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
    )
  `;
  
  db.query(createCategoriesTable, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error creating categories table' });
    }
    
    db.query(createProductsTable, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating products table' });
      }
      
      // Reset auto-increment counters
      db.query('ALTER TABLE categories AUTO_INCREMENT = 1', (err) => {
        if (err) console.error('Error resetting categories auto-increment');
        
        db.query('ALTER TABLE products AUTO_INCREMENT = 1', (err) => {
          if (err) console.error('Error resetting products auto-increment');
          
          res.json({ message: 'Database initialized successfully' });
        });
      });
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
