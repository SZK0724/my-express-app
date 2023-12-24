const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: Security operations
 * 
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Security personnel's username.
 *         password:
 *           type: string
 *           description: Security personnel's password.
 * 
 * /login/security:
 *   post:
 *     tags: [Security]
 *     summary: Security login
 *     description: This endpoint allows security personnel to log in.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successful login with token returned.
 *       401:
 *         description: Unauthorized access.
 */

router.get('/login/security', (req, res) => {
  res.send('/login/security');
});

module.exports = router;