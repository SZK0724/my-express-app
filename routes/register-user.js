const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /register/user:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to create an account.
 *     tags: [User]
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
 *         description: Account created successfully.
 *       400:
 *         description: Bad request.
 */

 router.get('/register/user', (req, res) => {
    res.send('你要什么!');
  });
  
  module.exports = router;