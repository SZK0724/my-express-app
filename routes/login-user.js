const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Login
 *     description: Operations for both regular users and security personnel
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
 *           description: Username of the user or security personnel.
 *         password:
 *           type: string
 *           description: Password of the user or security personnel.
 * 
 * /login:
 *   post:
 *     summary: User/Security login
 *     description: >
 *       Log in as a user or security personnel and receive an authentication token. 
 *       This endpoint is used by both regular users and security personnel for authentication.
 *     tags: [Login]
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
 *         description: Login unsuccessful due to invalid credentials or unauthorized access.
 *       500:
 *         description: Internal Server Error. Failed to process the login.
 */




router.get('/login/user', (req, res) => {
    res.send('/login/user');
  });
  
  module.exports = router;