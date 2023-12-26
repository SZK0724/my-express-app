const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User operations
 * 
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username.
 *         password:
 *           type: string
 *           description: User's password.
 * 
 * /login/user:
 *   post:
 *     summary: User login
 *     description: Log in as a user and receive an authentication token.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Successful login with token returned.
 *         content:
 *           application/json:
 *             example:
 *               message: Successful login
 *               token: generatedTokenString
 *       401:
 *         description: Login unsuccessful.
 *       500:
 *         description: Internal Server Error. Failed to process the login.
 */



router.get('/login/user', (req, res) => {
    res.send('/login/user');
  });
  
  module.exports = router;