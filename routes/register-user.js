const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /register/user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Register a new user account
 *     description: Allows an authentic security to create a new user account.
 *     tags: [Security]
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
 *       401:
 *         description: Unauthorized. Only security can create accounts.
 *       403:
 *         description: Forbidden. Only security can create accounts.
 */

 router.get('/register/user', (req, res) => {
    res.send('/register/user');
  });
  
  module.exports = router;