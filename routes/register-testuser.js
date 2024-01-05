const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /register/test/user:
 *   post:
 *     summary: Register a new test user account
 *     description: Allows anyone to create a new test user account. These accounts are inactive and for testing purposes only. Test account cannot perform any operation.
 *     tags: [Test Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test account created successfully.
 *       400:
 *         description: Bad request. Required fields are missing.
 */



 router.get('/register/test/user', (req, res) => {
    res.send('/register/test/user');
  });
  
  module.exports = router;