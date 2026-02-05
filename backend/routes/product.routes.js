const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 ADD PRODUCT
router.post('/', (req, res) => {
  const { productName, categoryId } = req.body;

  const sql = `
    INSERT INTO products (productName, categoryId)
    VALUES (?, ?)
  `;

  db.query(sql, [productName, categoryId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      productId: result.insertId,
      productName,
      categoryId
    });
  });
});


// 🔹 GET PRODUCTS WITH CATEGORY NAME (JOIN) - WITH PAGINATION
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  // Get total count for pagination
  const countSql = `
    SELECT COUNT(*) as total
    FROM products p
    JOIN categories c ON p.categoryId = c.categoryId
  `;

  // Get paginated data
  const dataSql = `
    SELECT 
      p.productId,
      p.productName,
      c.categoryId,
      c.categoryName
    FROM products p
    JOIN categories c ON p.categoryId = c.categoryId
    ORDER BY p.productId DESC
    LIMIT ? OFFSET ?
  `;

  // Execute both queries
  db.query(countSql, (err, countResult) => {
    if (err) return res.status(500).json(err);
    
    const total = countResult[0].total;
    
    db.query(dataSql, [pageSize, offset], (err, rows) => {
      if (err) return res.status(500).json(err);
      
      res.json({
        data: rows,
        pagination: {
          page: page,
          pageSize: pageSize,
          total: total,
          totalPages: Math.ceil(total / pageSize)
        }
      });
    });
  });
});

// 🔹 UPDATE PRODUCT
router.put('/:id', (req, res) => {
  const { productName, categoryId } = req.body;

  db.query(
    'UPDATE products SET productName=?, categoryId=? WHERE productId=?',
    [productName, categoryId, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'updated' });
    }
  );
});

// 🔹 DELETE PRODUCT WITH ID RESET
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Start transaction
  db.query('START TRANSACTION', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Delete the product
    db.query(
      'DELETE FROM products WHERE productId=?',
      [id],
      (err, result) => {
        if (err) {
          console.error(err);
          db.query('ROLLBACK');
          return res.status(500).json({ message: 'Database error' });
        }

        if (result.affectedRows === 0) {
          db.query('ROLLBACK');
          return res.status(404).json({ message: 'Product not found' });
        }

        // Reset IDs to be sequential starting from 1
        db.query(
          'SET @count = 0; UPDATE products SET productId = (@count:=@count+1) ORDER BY productId',
          (err) => {
            if (err) {
              console.error(err);
              db.query('ROLLBACK');
              return res.status(500).json({ message: 'Database error' });
            }

            // Reset auto-increment counter
            db.query(
              'ALTER TABLE products AUTO_INCREMENT = 1',
              (err) => {
                if (err) {
                  console.error(err);
                  db.query('ROLLBACK');
                  return res.status(500).json({ message: 'Database error' });
                }

                // Commit transaction
                db.query('COMMIT', (err) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Database error' });
                  }

                  res.json({ 
                    message: 'Product deleted and IDs reset successfully',
                    deletedProductId: Number(id)
                  });
                });
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
