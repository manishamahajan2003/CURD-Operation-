const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// ADD CATEGORY
router.post('/', (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: 'Category name required' });
  }

  const sql = 'INSERT INTO categories (categoryName) VALUES (?)';

  db.query(sql, [categoryName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    // ✅ IMPORTANT: send inserted data back
    res.json({
      categoryId: result.insertId,
      categoryName: categoryName
    });
  });
});

// GET ALL CATEGORIES
router.get('/', (req, res) => {
  db.query(
    'SELECT categoryId, categoryName FROM categories ORDER BY categoryId DESC',
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(rows);
    }
  );
});

// UPDATE CATEGORY
router.put('/:id', (req, res) => {
  const { categoryName } = req.body;
  const { id } = req.params;

  if (!categoryName) {
    return res.status(400).json({ message: 'Category name required' });
  }

  db.query(
    'UPDATE categories SET categoryName=? WHERE categoryId=?',
    [categoryName, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }

      // ✅ send updated record back
      res.json({
        categoryId: Number(id),
        categoryName: categoryName
      });
    }
  );
});

// DELETE CATEGORY WITH ID RESET
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Start transaction
  db.query('START TRANSACTION', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    // Delete the category
    db.query(
      'DELETE FROM categories WHERE categoryId=?',
      [id],
      (err, result) => {
        if (err) {
          console.error(err);
          db.query('ROLLBACK');
          return res.status(500).json({ message: 'Database error' });
        }

        if (result.affectedRows === 0) {
          db.query('ROLLBACK');
          return res.status(404).json({ message: 'Category not found' });
        }

        // Reset IDs to be sequential starting from 1
        db.query(
          'SET @count = 0; UPDATE categories SET categoryId = (@count:=@count+1) ORDER BY categoryId',
          (err) => {
            if (err) {
              console.error(err);
              db.query('ROLLBACK');
              return res.status(500).json({ message: 'Database error' });
            }

            // Reset auto-increment counter
            db.query(
              'ALTER TABLE categories AUTO_INCREMENT = 1',
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
                    message: 'Category deleted and IDs reset successfully',
                    deletedCategoryId: Number(id)
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
